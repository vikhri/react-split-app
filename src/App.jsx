import {useState} from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false)
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }
  function handleSplitBill(value) {
    setFriends(friends => friends.map((friend) => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>
  )
}


function Button({children, onClick}) {
 return <button className='button' onClick={onClick}>{children}</button>
}

function FriendsList({friends, onSelection, selectedFriend}) {

  return (
    <ul>
      {friends.map((friend) =>
        (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}></Friend>
        ))}
    </ul>
  )
}

function Friend({ friend, onSelection, selectedFriend}) {
  const isSelected = selectedFriend?.id === friend.id

  return <li className={isSelected ? 'selected' : ''}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 && (
      <p className='red'>
        You owe {friend.name} {Math.abs(friend.balance)}$
      </p>
    )}
    {friend.balance > 0 && (
      <p className='green'>
        {friend.name} owes you {Math.abs(friend.balance)}$
      </p>
    )}
    {friend.balance === 0 && (
      <p>
        You are even
      </p>
    )}
    <Button onClick={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
  </li>
}

function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48?u=118836')

  function handleSubmit(e)
  {
    e.preventDefault();

    if(!name || !image) return;

    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID()
    }

    onAddFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48?u=118836')
  }

  return (
    <form className='form-add-friend'
      onSubmit={handleSubmit}
    >
      <label>Friend name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>URL</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}/>
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}) {
  const[bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIPaying] = useState('user')

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill ||  !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);

  }

  return <form className='form-split-bill'
    onSubmit={handleSubmit}
  >
    <h2>Split a bill with {selectedFriend.name}</h2>
    <label>Bill value</label>
    <input type='text' value={bill} onChange={(e) => setBill(Number(e.target.value))}/>

    <label>Your expense</label>
    <input
      type='text'
      value={paidByUser}
      onChange={(e) =>
        setPaidByUser(
          Number(e.target.value) > bill ? paidByUser :
            Number(e.target.value))}/>

    <label>{selectedFriend.name}'s expense</label>
    <input type='text' disabled value={paidByFriend}/>

    <label>Who is paying?</label>
    <select value={whoIsPaying} onChange={(e) => setWhoIPaying(e.target.value)}>
      <option value='user'>You</option>
      <option value={selectedFriend}>{selectedFriend.name}</option>
    </select>
    <Button type='submit'>Submit</Button>
  </form>
}



export default App
