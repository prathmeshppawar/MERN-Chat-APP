import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserBadgeIcon = ({ user1, handleFunction }) => {
  const { user } = ChatState();
  return (
      <Box
          px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb="2"
          variant="solid"
          fontSize={12}
          background={user._id===user1._id?"maroon":"purple"}
          color="white"
          cursor="pointer"
          onClick={handleFunction}
      >
          {user1.name}
          <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeIcon
