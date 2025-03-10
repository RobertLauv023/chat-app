import axios from "axios";
import { HOST, SEARCH, SEARCH_ALL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/lib/api-client";

// Contact functions
const Contacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");

    const handleSearchUsers = async() => {
        try {
            const response = await apiClient.post(
                SEARCH,
                {
                    searchTerm
                },
            );

            if (response.status === 200) {
                setMessage("Users found");
                console.log("Message set to: users found"); 
            } else {
                setMessage("Missing search term");
            }

        } catch (error) {
            setMessage("Internal server error");
            console.log(error);
        }
    }; 

    const handleSearchAll = async() => {
      try {
        const response = await apiClient.post(
          SEARCH_ALL
        );

        if (response.status === 200) {
          setMessage("Users found");
        }

      } catch (error) {
        setMessage("Internal server error");
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
                  placeholder="search"
                  type="search"
                  className="rounded-full p-6"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Button className="rounded-full p-6" onClick={handleSearchUsers}>
                  SearchUsers
                </Button>
                <Button className="rounded-full p-6" onClick={handleSearchAll}>
                  SearchAll
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

export default Contacts;
