import axios from "axios";
import { HOST, SIGNUP_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, USER_INFO_ROUTE, UPDATE_PROFILE_ROUTE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/lib/api-client";



//const apiClient = axios.create({
//    baseURL: HOST,
//  });

  const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleUpdateProfile = async() => {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName, lastName
          },
          { withCredentials: true}
        );

        if (response.status === 200) {
          setMessage("Profile updated!");
        }
      } catch (error) {
        setMessage("Failed to update profile");
        console.log(error);
      }
    };

    const handleGetUserInfo = async () => {
      try {
        const response = await apiClient.post(
          USER_INFO_ROUTE,
        );

        if (response.status === 200) {
          setMessage("User data found");
        }
      } catch (error) {
        setMessage("Failed getting user info");
        console.log(error);
      }
    };

    const handleLogout = async () => {
      try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {
          withCredentials: true 
        }
      );

      if (response.status === 200) {
        setMessage("Logout successful!");
      }
      } catch (error) {
        setMessage("Logout failed. Please try again.");
        console.log(error);
      }
    };

    const handleLogin = async () => {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setMessage("Login Successful!");
        }
      } catch (error) {
        setMessage("Login failed. Please try again.");
        console.log(error);
      }
    };
    
    const handleSignup = async () => {
        try {
          const response = await apiClient.post(
            SIGNUP_ROUTE,
            {
              email,
              password,
            },
            { withCredentials: true }
          );
          if (response.status === 201) {
            setMessage("signup successful!");
          }
          else if (response.status === 400) {
            setMessage("Missing email or password");
          }
        } catch (error) {
          setMessage("Signup failed. Please try again.");
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
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Input
                    placeholder="firstName"
                    type="firstName"
                    className="rounded-full p-6"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="lastName"
                    type="lastName"
                    className="rounded-full p-6"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Button className="rounded-full p-6" onClick={handleSignup}>
                    Signup
                  </Button>
                  <Button className="rounded-full p-6" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button className="rounded-full p-6" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Button className="rounded-full p-6" onClick={handleGetUserInfo}>
                    UserInfo
                  </Button>
                  <Button className="rounded-full p-6" onClick={handleUpdateProfile}>
                    UpdateProfile
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
    

  export default Auth;
    