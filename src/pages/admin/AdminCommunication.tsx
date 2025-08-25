
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, User } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  apartment?: string;
}

const AdminCommunication: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Carlos Mendoza',
      content: 'Buenos días, quisiera reportar un problema con el agua caliente en mi apartamento.',
      timestamp: '2024-01-15 09:30',
      isAdmin: false,
      apartment: 'Apt 301'
    },
    {
      id: '2',
      sender: 'Ana García',
      content: 'Buenos días Carlos, gracias por reportar el problema. Voy a coordinar con el técnico para que revise el sistema de agua caliente.',
      timestamp: '2024-01-15 10:15',
      isAdmin: true
    },
    {
      id: '3',
      sender: 'María Rodriguez',
      content: 'Hola, quería consultar sobre el horario de funcionamiento del gimnasio.',
      timestamp: '2024-01-15 14:22',
      isAdmin: false,
      apartment: 'Apt 205'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'Ana García',
        content: newMessage,
        timestamp: new Date().toLocaleString('es-ES', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isAdmin: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-codomi-navy" />
        <h1 className="text-3xl font-bold text-codomi-navy">Comunicación</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-gray-50/50">
          <CardTitle className="text-xl text-codomi-navy">Chat Comunitario</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[calc(100vh-20rem)]">
            {/* Área de mensajes con scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-gradient-to-b from-gray-50/30 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[75%] ${message.isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-10 w-10 flex-shrink-0 shadow-sm">
                      <AvatarFallback className={message.isAdmin ? 'bg-codomi-navy text-white' : 'bg-gray-100 text-gray-600'}>
                        {message.isAdmin ? 'AD' : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`space-y-2 ${message.isAdmin ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{message.sender}</span>
                        {message.apartment && <span className="bg-gray-100 px-2 py-1 rounded-full">({message.apartment})</span>}
                        <span>{message.timestamp}</span>
                      </div>
                      <div
                        className={`p-4 rounded-xl text-sm shadow-sm ${
                          message.isAdmin
                            ? 'bg-codomi-navy text-white rounded-br-md'
                            : 'bg-white border border-gray-200 rounded-bl-md'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de envío */}
            <div className="border-t bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 text-base border-gray-300 focus:border-codomi-navy"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-codomi-navy hover:bg-codomi-navy-dark shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommunication;
