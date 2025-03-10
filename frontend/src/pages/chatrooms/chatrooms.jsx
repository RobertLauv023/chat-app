import axios from "axios";
import { HOST, CREATE_CHATROOM, GET_CHATROOMS_ROUTE, DELETE_CHATROOMS_ROUTE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/lib/api-client";

// Chatroom functions
const Chatrooms = () => {
    const [roomName, setRoomName] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateRoom = async() => {
        try {
            const response = await apiClient.post(
                CREATE_CHATROOM,
                {
                    roomName
                },
            );

            if (response.status === 200) {
                setMessage("Chatroom created!");
            } else if (response.status === 409 ){
                setMessage("Room name already exists");
            } else {
              setMessage("Missing room name field");
            }

        } catch (error) {
            setMessage("Internal server error");
            console.log(error);
        }
    }; 


    const handleGetRooms = async() => {
      try {
        const response = await apiClient.post(
          GET_CHATROOMS_ROUTE
        );

        if (response.status === 200) {
          setMessage("Chat rooms found!");
        } else if (response.status === 400) {
          setMessage("No chat rooms found");
        }
      } catch (error) {
        setMessage("Internal server error");
        console.log(error);
      }
    };

    const handleDeleteRooms = async() => {
      try {
        const response = await apiClient.post(
          DELETE_CHATROOMS_ROUTE,
          { data: { roomName: roomName }},
        );

        if (response.status === 200) {
          setMessage("Chat room deleted!")
        } else if (response.status === 404) {
          setMessage("Chat room does not exist");
        } else {
          setMessage("Missing or invalid room name field");
        }

      } catch (error) {
        setMessage("Internal service error");
        console.log(error);
      }
    };



    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
          <div className="flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
              </div>
            </div>
            <div className="flex items-center justify-center w-full ">
              <div className="w-3/4 flex flex-col gap-5">
                <Input
                  placeholder="roomName"
                  type="roomName"
                  className="rounded-full p-6"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                
                <Button className="rounded-full p-6" onClick={handleCreateRoom}>
                  Create Room
                </Button>
                <Button className="rounded-full p-6" onClick={handleGetRooms}>
                  Get Rooms
                </Button>
                <Button className="rounded-full p-6" onClick={handleDeleteRooms}>
                  Delete Room
                </Button>
                
                {message && (
                  <p className="text-center mt-4 font-semibold">{message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="hidden xl:flex justify-center items-center ">
          </div>
        </div>
      </div>
    );
};

export default Chatrooms;
