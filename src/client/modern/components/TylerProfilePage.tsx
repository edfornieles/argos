import * as React from "react";
import { useSimulationStore } from "../../../state/simulation";
import { AgentInspector } from "./inspectors/AgentInspector";
import { WebSocketService } from "../../services/websocket";

// Error categories for better error handling
type ErrorCategory = 
  | 'connection' 
  | 'subscription' 
  | 'agent' 
  | 'simulation' 
  | 'storage' 
  | 'unknown';

interface ErrorInfo {
  category: ErrorCategory;
  message: string;
  details?: string;
  timestamp: number;
}

// Error display component with more detailed error information
function ErrorDisplay({ error, onRetry, details, category }: { 
  error: string; 
  onRetry?: () => void; 
  details?: string;
  category: ErrorCategory;
}) {
  const getCategoryColor = (category: ErrorCategory) => {
    switch (category) {
      case 'connection': return 'bg-blue-500/20 text-blue-400';
      case 'subscription': return 'bg-purple-500/20 text-purple-400';
      case 'agent': return 'bg-yellow-500/20 text-yellow-400';
      case 'simulation': return 'bg-orange-500/20 text-orange-400';
      case 'storage': return 'bg-red-500/20 text-red-400';
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div className="text-center p-4 bg-red-500/10 rounded-lg">
      <div className={`px-3 py-1 rounded-full text-sm inline-block mb-2 ${getCategoryColor(category)}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)} Error
      </div>
      <div className="text-red-400 mb-2">{error}</div>
      {details && (
        <div className="text-sm text-red-300/80 mb-4">
          {details}
        </div>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}

export function TylerProfilePage() {
  // Connection state
  const [connectionState, setConnectionState] = React.useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [error, setError] = React.useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  
  // Simulation state
  const agents = useSimulationStore((state) => state.agents);
  const logs = useSimulationStore((state) => state.logs);
  const wsRef = React.useRef<WebSocketService>();
  
  // Find Tyler by name (case-insensitive)
  const tyler = React.useMemo(() => 
    agents.find(a => a.name.toLowerCase() === "tyler"),
    [agents]
  );

  // Handle retry
  const handleRetry = React.useCallback(() => {
    setError(null);
    setConnectionState('connecting');
    setRetryCount(prev => prev + 1);
  }, []);

  // Log error with category
  const logError = React.useCallback((category: ErrorCategory, message: string, details?: string) => {
    console.error(`[${category.toUpperCase()}] ${message}`, details ? `\nDetails: ${details}` : '');
    setError({
      category,
      message,
      details,
      timestamp: Date.now()
    });
  }, []);

  // Initialize WebSocket connection
  React.useEffect(() => {
    let mounted = true;
    setConnectionState('connecting');
    setError(null);

    try {
      const ws = new WebSocketService(`ws://${window.location.hostname}:3000/ws`);
      wsRef.current = ws;

      const unsubscribe = ws.subscribe((message) => {
        if (!mounted) return;
        
        if (message.type === "CONNECTION_UPDATE") {
          if (message.connected) {
            setConnectionState('connected');
            setError(null);
          } else {
            setConnectionState('disconnected');
            logError(
              'connection',
              'Lost connection to simulation server',
              'The WebSocket connection was closed unexpectedly'
            );
          }
        }
      });

      return () => {
        mounted = false;
        unsubscribe();
        ws.disconnect();
      };
    } catch (err) {
      console.error("Failed to initialize WebSocket:", err);
      setConnectionState('error');
      logError(
        'connection',
        "Failed to connect to simulation server",
        err instanceof Error ? err.message : 'Unknown error occurred'
      );
      return () => {};
    }
  }, [retryCount, logError]);

  // Subscribe to Tyler's updates when connected
  React.useEffect(() => {
    if (!tyler || !wsRef.current || connectionState !== 'connected') return;
    
    try {
      // Subscribe to Tyler's updates in the main room
      wsRef.current.subscribeToAgent(tyler.id, "main");
      
      return () => {
        wsRef.current?.unsubscribeFromAgent(tyler.id);
      };
    } catch (err) {
      console.error("Failed to subscribe to Tyler:", err);
      logError(
        'subscription',
        "Failed to subscribe to Tyler's updates",
        err instanceof Error ? err.message : 'Unknown error occurred'
      );
      return () => {};
    }
  }, [tyler, connectionState, logError]);

  // Handle reconnection
  React.useEffect(() => {
    if (connectionState === 'disconnected' && wsRef.current) {
      const timeout = setTimeout(() => {
        try {
          wsRef.current?.connect();
        } catch (err) {
          console.error("Failed to reconnect:", err);
          logError(
            'connection',
            "Failed to reconnect to simulation server",
            err instanceof Error ? err.message : 'Unknown error occurred'
          );
        }
      }, 5000); // Try to reconnect after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [connectionState, logError]);

  // Handle agent not found
  React.useEffect(() => {
    if (connectionState === 'connected' && !tyler) {
      logError(
        'agent',
        "Tyler not found in simulation",
        "Please ensure the simulation is running and Tyler is active"
      );
    }
  }, [connectionState, tyler, logError]);

  return (
    <div className="min-h-screen bg-[#0B1221] text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-emerald-400">Tyler's Profile</h1>
            <div className={`px-3 py-1 rounded-full text-sm ${
              connectionState === 'connected' ? 'bg-green-500/20 text-green-400' :
              connectionState === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {connectionState === 'connected' ? 'Connected' :
               connectionState === 'connecting' ? 'Connecting...' :
               'Disconnected'}
            </div>
          </div>

          {error ? (
            <ErrorDisplay 
              error={error.message}
              details={error.details}
              category={error.category}
              onRetry={handleRetry}
            />
          ) : connectionState === 'connecting' ? (
            <div className="text-center text-gray-400">
              Connecting to simulation...
            </div>
          ) : !tyler ? (
            <div className="text-center text-gray-400">
              Tyler not found in simulation. Please ensure the simulation is running.
            </div>
          ) : (
            <AgentInspector agent={tyler} logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
} 