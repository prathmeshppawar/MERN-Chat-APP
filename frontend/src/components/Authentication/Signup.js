import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();
  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Image not Selected",
        description: "Please Select an Image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image.jpg") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "prathmeshpawar");
      fetch("https://api.cloudinary.com/v1_1/prathmeshpawar/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
        .then(data => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
      })
    } else {
      toast({
        title: "Image Not Supported",
        description: "Please Upload Image in .jpeg or .jpg Format",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async() => {
    setLoading(true);
    if (!name || !password || !email) {
      toast({
        title: "Incomplete Details",
        description: "Please Fill All the Required Fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwor Mismatch",
        description: "Please Re-enter Your Passwords",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPassword("");
      setConfirmpassword("");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };
      const { data } = await axios.post(
        "api/user", { name, email, password, pic }, config
      );
      toast({
        title: "Registration Successful",
        description: "Your Acount Has Been Created Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" h="1.75rem" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          value={confirmpassword}
          type={show ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
      </FormControl>
      <FormControl>Upload Your Picture</FormControl>
      <FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e)=> postDetails(e.target.files[0])}
        />
      </FormLabel>
      <Button
        w={"100%"}
        colorScheme="blue"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup
