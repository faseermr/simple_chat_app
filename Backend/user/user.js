// handle users
let users = [];

const addUsers = ({ id, username, room }) => {
  console.log("details", id, username, room);
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check username and room is empty
  if (!username || !room) {
    return { error: "Name and Room are required." };
  }

  // check username and room already exists
  if (users.length) {
    const data = users.find((e) => e.username === username && e.room === room);
    console.log("data", data);
    if (data) {
      return { error: "user already exist" };
    }
  }
  const response = { id, username, room };

  users.push(response);

  return { response };
};

const getUser = (id) => {
  return users.find((e) => e.id == id);
};

const removeUser = (id) => {
  const findIdx = users.findIndex((user) => user.id == id);

  if (findIdx >= 0) {
    return users.splice(findIdx, 1)[0];
  }
};

const getRoomUsers = (room) => {
  return users.filter((e) => e.room === room);
};

module.exports = { addUsers, getUser, removeUser, getRoomUsers };
