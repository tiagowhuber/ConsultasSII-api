import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

export interface NewRecordNotification {
  folio: string;
  rutProveedor: string;
  razonSocial: string;
  montoTotal: number;
  tipoDTE: number;
  tipoDTEString: string;
  fechaEmision: string;
  timestamp: string;
}

class NotificationService {
  private io: SocketIOServer | null = null;

  initialize(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:5174',
          'https://consultassii.netlify.app',
          /^https:\/\/[a-zA-Z0-9-]+--consultassii\.netlify\.app$/,
        ],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`📡 Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`📡 Client disconnected: ${socket.id}`);
      });
    });
  }

  // Send notification about new record
  notifyNewRecord(notification: NewRecordNotification) {
    if (!this.io) return;
    
    this.io.emit('new_record', notification);
    console.log(`New record notification sent:`, notification);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.io ? this.io.engine.clientsCount : 0;
  }
}

export const notificationService = new NotificationService();