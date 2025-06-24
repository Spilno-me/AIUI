import { PermitApplicationWizard } from '@/components/permit-application/PermitApplicationWizard';
import { useWebSocket } from '@/hooks/useWebSocket';

function App() {
  const { isConnected } = useWebSocket({
    url: 'ws://localhost:8765',
    onOpen: () => console.log('WebSocket connected'),
    onMessage: (event) => console.log('Received:', event.data),
    onError: (error) => console.error('WebSocket error:', error),
    onClose: () => console.log('WebSocket disconnected'),
  });

  return (
    <>
      {!isConnected && (
        <div style={{ position: 'fixed', top: 10, right: 10, background: '#ff4444', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}>
          WebSocket disconnected
        </div>
      )}
      <PermitApplicationWizard />
    </>
  );
}

export default App;