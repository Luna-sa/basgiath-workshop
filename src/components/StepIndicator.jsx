export default function StepIndicator({ steps, currentStepId, completedIds = [] }) {
  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {steps.map((step, i) => {
        const isActive = step.id === currentStepId
        const isCompleted = completedIds.includes(step.id)

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center border text-[12px] font-mono transition-all ${
              isCompleted
                ? 'border-forest bg-forest text-black'
                : isActive
                  ? 'border-qa-teal bg-qa-teal/10 text-qa-teal'
                  : 'border-border text-text-dim'
            }`}>
              {isCompleted ? '✓' : step.id.toUpperCase()}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px ${isCompleted ? 'bg-forest' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
