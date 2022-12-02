import './App.css';
import axios from 'axios';
import {useEffect, useState} from 'react';

function App() {

  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const [users, setUsers] = useState([])
  const [toggleRefresh, setToggleRefresh] = useState(true)

 

  useEffect(()=> {

    let getAllUsers = async () => {
    let response = await axios.get('http://localhost:5000/users')

    setUsers(response.data.data)
    }
    getAllUsers();

  }, [toggleRefresh])


  const doSignup = async (e) => {
    e.preventDefault();

    var profilePicInput = document.getElementById("profilePicInput");
    console.log("profilePicInput: ", profilePicInput.files); //local url

    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

    // formData.append("myFile", blob, "myFileNameAbc"); // you can also send file in Blob form (but you really dont need to covert a File into blob since it is Actually same, Blob is just a new implementation and nothing else, and most of the time (as of january 2021) when someone function says I accept Blob it means File or Blob) see: https://stackoverflow.com/questions/33855167/convert-data-file-to-blob
    formData.append("name", Name); // this is how you add some text data along with file
    formData.append("email", Email); // this is how you add some text data along with file
    formData.append("password", Password); // this is how you add some text data along with file
    formData.append("profilePic", profilePicInput.files[0]); // file input is for browser only, use fs to read file in nodejs client

    axios({
      method: 'post',
      url: "http://localhost:5000/signup",
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      // withCredentials: true
  })
      .then(res => {
          console.log(`upload Success` + res.data);
          setToggleRefresh(!toggleRefresh)
      })
      .catch(err => {
          console.log(err);
      })
  
   }
   
  return (
    <div>
             
           <form onSubmit={doSignup} className='form'>
            Name: <input name='name' type='text' placeholder='enter a name here' id='name' onChange={(e)=>{setName(e.target.value)}}></input> 
            <br></br><br></br>
            Email: <input name='email' type='email' placeholder='enter email here' id='email' onChange={(e)=>{setEmail(e.target.value)}}></input> 
            <br></br><br></br>
            Password: <input name='password' type='text' placeholder='enter a password here' id='password' onChange={(e)=>{setPassword(e.target.value)}}></input> 
            <br></br><br></br>
            {/* Password Confirmation: <input name='password-confirmation' type='text' placeholder='enter your password here again' ></input> <br></br> <br></br> */}
            Profile Picture <input type='file' id='profilePicInput' accept='image/*' onChange={()=>{
               //to display image instantly on screen
               var profilePicInput = document.getElementById("profilePicInput");

                var url = URL.createObjectURL(profilePicInput.files[0])
                console.log("url: ", url);

                document.getElementById("img").innerHTML = `<img width='200px' src="${url}" alt="" id="img"> `
               //to display image instantly on screen

            }}></input> <br></br>

            <div id='img'></div>
            <br></br>
            <button type='submit'>Signup</button>
           </form>
       
           <h1>Users List</h1>

           <div>
            {users.map(eachUser => (
              <div key={eachUser.id}>
                <span>{eachUser.name}</span>
                <span>{eachUser.email}</span>
                <img width="100px" src={eachUser.profilePicture} alt="" />
              </div>
            ))}
           </div>
  
             {/* <div>File Upload</div>
            <img style={{"border": "1px solid black" ,"margin":"5px"}} width={200}
            src='https://res.cloudinary.com/dbuon4q81/image/upload/v1669826183/taetae2_q4dphf.jpg' 
            alt=''></img>
            <br></br>
            <img style={{"border": "1px solid black" ,"margin":"5px"}} width={200}
            src='https://res.cloudinary.com/dbuon4q81/image/upload/v1669828527/Dad-dy_Taekook__Yoonmin_uv6tla.jpg' 
            alt=''></img>
            <br></br>
            <img style={{"border": "1px solid black" ,"margin":"5px"}} width={200}
            src='https://firebasestorage.googleapis.com/v0/b/ecommerce-app-6a346.appspot.com/o/taetae.jpg?alt=media&token=7a84ab89-8037-43e5-95bf-b601b266662f' 
            alt=''></img>
         */}
        </div> 
  );
}

export default App;
