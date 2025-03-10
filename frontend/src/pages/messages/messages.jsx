import axios from "axios";
import { HOST, SEND_MESSAGE_ROUTE, GET_MESSAGE_ROUTE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/lib/api-client";

// Message functions
const Messages = () => {
    const [roomName, setRoomName] = useState("");
    const [sender, setSender] = useState("");
    const [toSend, setToSend] = useState("");
    const [message, setMessage] = useState("");

    const handleSendMessage = async() => {
        try {
            const response = await apiClient.post(
                SEND_MESSAGE_ROUTE,
                {
                    roomName, sender, toSend
                },
            );

            if (response.status === 200) {
                setMessage("Message sent");
            } else {
                setMessage("Missing roomName, sender, or message fields");
            }
        } catch (error) {
            setMessage("Internal service error");
            console.log(error);
        }
    }

    const handleGetMessages = async() => {
        try {
            const response = await apiClient.post(
                GET_MESSAGE_ROUTE, 
                {
                    roomName
                },
            );

            if (response.status === 200) {
                setMessage("Messages found");
            } else {
                setMessage("Missing room name or room doesn't exist");
            }
        } catch (error) {
            setMessage("Internal service error");
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
                <Input
                  placeholder="sender"
                  type="sender"
                  className="rounded-full p-6"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
                <Input
                  placeholder="toSend"
                  type="toSend"
                  className="rounded-full p-6"
                  value={toSend}
                  onChange={(e) => setToSend(e.target.value)}
                />
                
                <Button className="rounded-full p-6" onClick={handleSendMessage}>
                  Send
                </Button>
                <Button className="rounded-full p-6" onClick={handleGetMessages}>
                  Get Messages
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

export default Messages;
