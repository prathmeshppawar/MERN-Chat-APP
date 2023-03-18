import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect } from 'react'
import { getSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ChatLoading from './miscellaneous/ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const { setSelectedChat, selectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Failed to Load the Chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        width={"100%"}
        justifyContent="space-between"
        alignItems={"center"}
        fontFamily="Work sans"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w={"100%"}
        h="100%"
        borderRadius={"lg"}
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
                <Text fontSize={"xs"}>
                  {!chat.isGroupChat ? (
                    chat.latestMessage ? (
                      chat.latestMessage.content
                    ) : (
                      ""
                    )
                  ) : chat.latestMessage ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Text fontWeight={"bold"}>
                        {chat.latestMessage.sender.name} :
                      </Text>
                      <Text>
                        <pre> {chat.latestMessage.content}</pre>
                      </Text>
                    </div>
                  ) : (
                    ""
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats
