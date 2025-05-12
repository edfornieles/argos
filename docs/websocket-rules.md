# WebSocket and Simulation Rules

## Connection Lifecycle

1. **Initial Connection**
   - WebSocket service must be initialized with proper URL
   - Connection state must be tracked (connecting, connected, disconnected)
   - Connection updates must be broadcast to all handlers
   - Storage access must be handled safely with fallbacks

2. **Message Processing**
   - Messages are queued and processed every 100ms
   - Messages are deduplicated within 100ms window
   - Connection updates are sent immediately
   - Other messages are queued for processing

3. **Subscription Management**
   - Room subscriptions must be managed properly
   - Agent subscriptions must be tracked
   - Subscriptions must be cleaned up on unmount
   - Room and agent subscriptions must be coordinated

## Simulation State

1. **Agent Management**
   - Agents must be properly initialized with components
   - Agent state must be tracked (active, location, etc.)
   - Agent updates must be processed in order
   - Agent subscriptions must be managed per room

2. **Room Management**
   - Rooms must be properly initialized
   - Room state must be tracked
   - Room occupants must be managed
   - Room connections must be maintained

3. **System Processing**
   - Conscious systems run every 10s
   - Subconscious systems run every 25s
   - Unconscious systems run every 50s
   - Systems must process agents in order

## Error Handling

1. **Connection Errors**
   - Storage access errors must be caught and handled
   - Connection failures must be reported
   - Reconnection attempts must be managed
   - Cleanup must be performed on disconnect

2. **Message Errors**
   - JSON parsing errors must be caught
   - Message processing errors must be handled
   - Invalid messages must be skipped
   - Error states must be reported to UI

3. **State Errors**
   - Invalid state transitions must be prevented
   - State inconsistencies must be detected
   - Error recovery must be attempted
   - Error states must be reported

## Best Practices

1. **Component Design**
   - Components must handle connection state
   - Components must manage subscriptions
   - Components must clean up on unmount
   - Components must handle errors gracefully

2. **State Management**
   - State must be updated atomically
   - State updates must be batched
   - State must be consistent
   - State must be observable

3. **Performance**
   - Messages must be deduplicated
   - Updates must be batched
   - Subscriptions must be optimized
   - Cleanup must be thorough

## Implementation Notes

1. **WebSocket Service**
   ```typescript
   class WebSocketService {
     private ws: WebSocket | null = null;
     private handlers: Set<(message: ServerMessage) => void>;
     private messageQueue: ServerMessage[];
     private isProcessingQueue: boolean;
     private lastMessageTimes: Map<string, number>;
   }
   ```

2. **Connection States**
   ```typescript
   type ConnectionState = 
     | 'connecting'
     | 'connected'
     | 'disconnected'
     | 'error';
   ```

3. **Message Types**
   ```typescript
   type ServerMessage = 
     | ConnectionUpdateMessage
     | WorldUpdateMessage
     | AgentUpdateMessage
     | RoomUpdateMessage;
   ```

## Common Issues

1. **Storage Access**
   - Use `safeStorageAccess` for all storage operations
   - Provide fallbacks for storage failures
   - Handle storage errors gracefully
   - Report storage issues to UI

2. **Connection Management**
   - Handle connection lifecycle properly
   - Manage reconnection attempts
   - Clean up on unmount
   - Report connection state

3. **State Synchronization**
   - Keep state consistent
   - Handle state updates properly
   - Manage subscriptions correctly
   - Clean up state on unmount 