import { useState, useRef, useCallback } from 'react';

/**
 * Browser voice recorder using MediaRecorder.
 *
 * Returns:
 *   supported         — boolean, true if the browser has MediaRecorder + getUserMedia
 *   state             — 'idle' | 'recording' | 'stopping'
 *   error             — string or null (permission denied, no device, etc.)
 *   start()           — request mic, begin recording
 *   stop()            — stop, return { audio: base64, mimeType, duration }
 *   cancel()          — stop without returning audio (discard)
 */
export function useVoiceRecorder() {
    const [state, setState] = useState('idle');
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const startedAtRef = useRef(0);

    const supported = typeof window !== 'undefined'
        && typeof navigator !== 'undefined'
        && !!navigator.mediaDevices?.getUserMedia
        && typeof window.MediaRecorder !== 'undefined';

    const start = useCallback(async () => {
        if (!supported) {
            setError('unsupported');
            return false;
        }
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Prefer webm/opus — best Whisper-compatible browser format.
            // Safari falls back to mp4.
            const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
            const mimeType = candidates.find(m => MediaRecorder.isTypeSupported(m)) || '';

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            startedAtRef.current = Date.now();

            recorder.ondataavailable = (evt) => {
                if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data);
            };

            recorder.start();
            setState('recording');
            return true;
        } catch (err) {
            console.warn('Voice recorder start failed', err);
            setError(err?.name || 'error');
            cleanupStream();
            setState('idle');
            return false;
        }
    }, [supported]);

    const cleanupStream = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    };

    const stop = useCallback(() => {
        return new Promise((resolve) => {
            const recorder = mediaRecorderRef.current;
            if (!recorder || recorder.state === 'inactive') {
                setState('idle');
                resolve(null);
                return;
            }

            setState('stopping');
            const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
            const mimeType = recorder.mimeType || 'audio/webm';

            recorder.onstop = async () => {
                cleanupStream();
                const blob = new Blob(chunksRef.current, { type: mimeType });
                chunksRef.current = [];
                mediaRecorderRef.current = null;
                setState('idle');

                if (blob.size < 1024) {
                    resolve(null);
                    return;
                }

                const base64 = await blobToBase64(blob);
                resolve({ audio: base64, mimeType, duration });
            };
            recorder.stop();
        });
    }, []);

    const cancel = useCallback(() => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== 'inactive') {
            recorder.onstop = null;
            try { recorder.stop(); } catch {}
        }
        cleanupStream();
        chunksRef.current = [];
        mediaRecorderRef.current = null;
        setState('idle');
        setError(null);
    }, []);

    return { supported, state, error, start, stop, cancel };
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result !== 'string') { reject(new Error('FileReader result is not string')); return; }
            // Strip "data:audio/webm;base64," prefix — send raw base64.
            const comma = result.indexOf(',');
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}
