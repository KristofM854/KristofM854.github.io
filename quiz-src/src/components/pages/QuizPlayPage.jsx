import Card from '../shared/Card.jsx'

function QuizPlayPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="font-display font-bold text-3xl text-text-primary text-center">
          Quiz
        </h1>
        <Card>
          <p className="text-text-secondary text-center">
            The interactive quiz gameplay will be built in Phase 4.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default QuizPlayPage
