"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { rtdb } from "@/firebase/config";
import { ref, push, onValue, update, remove, type Unsubscribe } from "firebase/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Room {
  id?: string;
  name: string;
  host: string;
  players: string[];
  maxPlayers: number;
  status: "waiting" | "playing";
}

export default function ArenaLobbyPage() {
  const router = useRouter();
  const { progress, isAuthenticated } = useGame();
  const [mounted, setMounted] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);

    const roomsRef = ref(rtdb, "rooms");
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRooms([]);
        return;
      }
      const roomList: Room[] = Object.entries(data).map(([id, room]: [string, any]) => ({
        id,
        ...room,
        players: room.players ? Object.keys(room.players) : [],
      }));
      setRooms(roomList.filter((r) => r.status === "waiting"));
    });

    return () => unsubscribe();
  }, [isAuthenticated, router]);

  const createRoom = async () => {
    if (!roomName.trim()) return;
    const roomsRef = ref(rtdb, "rooms");
    const newRoomRef = push(roomsRef, {
      name: roomName.trim(),
      host: progress.username,
      players: { [progress.username]: { name: progress.username, score: 0 } },
      maxPlayers: 5,
      status: "waiting",
      createdAt: Date.now(),
    });
    setShowCreate(false);
    setRoomName("");
    router.push("/arena/" + newRoomRef.key);
  };

  const joinRoom = async (room: Room) => {
    if (!room.id) return;
    const playerRef = ref(rtdb, `rooms/${room.id}/players/${progress.username}`);
    await update(ref(rtdb), {
      [`rooms/${room.id}/players/${progress.username}`]: {
        name: progress.username,
        score: 0,
      },
    });
    router.push("/arena/" + room.id);
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900">🏟️ Arena Multiplayer</h1>
        <p className="text-purple-500">
          Compite con hasta 5 amigos en batallas bíblicas en tiempo real
        </p>
      </div>

      <div className="flex justify-center">
        <Button variant="gold" size="lg" onClick={() => setShowCreate(!showCreate)}>
          + Crear Sala
        </Button>
      </div>

      {showCreate && (
        <Card className="max-w-md mx-auto space-y-4 animate-slide-up">
          <h3 className="font-bold text-purple-900">Crear nueva sala</h3>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Nombre de la sala..."
            className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
            onKeyDown={(e) => e.key === "Enter" && createRoom()}
            autoFocus
            maxLength={30}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={createRoom} disabled={!roomName.trim()}>
              Crear Sala
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-purple-900">Salas disponibles</h2>
        {rooms.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-4xl mb-3">🏟️</div>
            <p className="text-purple-500">No hay salas disponibles. ¡Crea una!</p>
          </Card>
        ) : (
          rooms.map((room) => (
            <Card key={room.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                  🏟️
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">{room.name}</h3>
                  <p className="text-xs text-purple-500">
                    Creado por {room.host} · {room.players?.length || 0}/{room.maxPlayers} jugadores
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => joinRoom(room)}
                disabled={(room.players?.length || 0) >= room.maxPlayers}
              >
                Unirse
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
