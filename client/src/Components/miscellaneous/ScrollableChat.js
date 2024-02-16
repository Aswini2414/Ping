import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { getSenderOfGroup, isLastMessage,isSameSender,isSameSenderMargin,isSameUser } from '../../config/chatLogics';

const ScrollableChat = ({ messages }) => {
    const userData = useSelector((state) => state.user);
  return (
    <ScrollableFeed>
      {messages.map((m, i) => {
        const { sender, content, chat } = m;
        return (
          <>
            {chat.isGroupChat ? (
              <div>
                <div style={{ display: "flex" }} key={m._id}>
                  {(isSameSender(messages, m, i, userData._id) ||
                    isLastMessage(messages, i, userData._id)) && (
                    <div className='flex px-1 justify-center items-center bg-pink-200 rounded mt-2'>
                      <img
                        src={
                          m.sender.image
                            ? m.sender.image
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLbOasrP2azsdMM1tvCRXeHVcSPK0kV1WfA&usqp=CAU"
                        }
                        cursor-pointer
                        className="w-7
                        h-10 mr-2
                        rounded-full"
                      />
                      <h1>{getSenderOfGroup(m)}</h1>
                    </div>
                  )}
                  <span
                    style={{
                      backgroundColor: `${
                        m.sender._id === userData._id ? "#BEE3F8" : "#B9F5D0"
                      }`,
                      marginLeft: isSameSenderMargin(
                        messages,
                        m,
                        i,
                        userData._id
                      ),
                      marginTop: isSameUser(messages, m, i, userData._id)
                        ? 3
                        : 10,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex" }} key={m._id}>
                  {(isSameSender(messages, m, i, userData._id) ||
                    isLastMessage(messages, i, userData._id)) && (
                    <img
                      src={
                        m.sender.image
                          ? m.sender.image
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLbOasrP2azsdMM1tvCRXeHVcSPK0kV1WfA&usqp=CAU"
                      }
                      cursor-pointer
                      className="w-7
                        h-10 mr-2
                        rounded-full"
                    />
                  )}
                  <span
                    style={{
                      backgroundColor: `${
                        m.sender._id === userData._id ? "#BEE3F8" : "#B9F5D0"
                      }`,
                      marginLeft: isSameSenderMargin(
                        messages,
                        m,
                        i,
                        userData._id
                      ),
                      marginTop: isSameUser(messages, m, i, userData._id)
                        ? 3
                        : 10,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              </div>
            )}
          </>
        );})}
        
    </ScrollableFeed>
  );
}

export default ScrollableChat