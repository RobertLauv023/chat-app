
const apiClient = axios.create({
    baseURL: HOST,
  });

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
        setMessage("Login successful!");
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
          setMessage("Signup successful!");
        }
      } catch (error) {
        setMessage("Signup failed. Please try again.");
        console.log(error);
      }
    };

    