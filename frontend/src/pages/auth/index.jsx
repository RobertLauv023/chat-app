const apiClient = axios.create({
    baseURL: HOST,
  });
  
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
          setMessage("Signup successful!");
        }
      } catch (error) {
        setMessage("Signup failed. Please try again.");
        console.log(error);
      }
    };