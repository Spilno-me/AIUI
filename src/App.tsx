import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">AIUI</CardTitle>
          <CardDescription>
            Built with React, TypeScript, Vite & shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">Count: {count}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setCount((count) => count + 1)}>
                Increment
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
              <Button variant="secondary" onClick={() => setCount((count) => count - 1)}>
                Decrement
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Button Variants:</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="default" size="sm">Default</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="link" size="sm">Link</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App