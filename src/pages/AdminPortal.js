import react from 'react'
import React, { useState, useEffect } from 'react';
import '../css/AdminPortal.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/analytics';
import 'firebase/compat/database';
import { useHistory } from 'react-router-dom';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";


/*Login Page for Admins that uses React JS, HTML, CSS, and Bootstrap 5*/
const adminFirebaseConfig = {
    apiKey: "AIzaSyB0pkdIGT5RiCe5jPY2628O27X_sTk3Xn4",
    authDomain: "team-pwd-admin.firebaseapp.com",
    projectId: "team-pwd-admin",
    storageBucket: "team-pwd-admin.appspot.com",
    messagingSenderId: "445587795844",
    appId: "1:445587795844:web:9b1ed3d5902ddca9d577d1",
    measurementId: "G-0FLPMK8X2Z"
};

 // Initialize Firebase for admins
const adminApp = firebase.initializeApp(adminFirebaseConfig, 'admin-app');
console.log(adminApp);
const adminAuth = adminApp.auth();

//done is used so that the function can run onLoad but is only used once
//to check if 
let done = false;
onAuthStateChanged(adminAuth, (currentUser) => {
  if (currentUser && !done) {
    //admin user is signed in
    done = true;
    return;
  } 
  else if(!currentUser && !done) {
    // User is signed out
    //hide the webpage if no viable admin user
    done = true;
    document.getElementById('adminPortalWrapper').style.visibility = "hidden";
    window.location.href = '/';
    console.error(401);
    return;
  }
  return;
});

const databaseAdmin = firebase.database(adminApp);

  /*
  const submissionData = {
    'id': 'Submission 6'
  };

  databaseAdmin.ref('Submissions/').set(submissionData) //change submission data in db
*/
    

export function AdminPortal() {

 //DYNAMIC SUBMISSIONS AND LOCK STATES
    const [submissions, setSubmissions] = useState([
        { id: 1, name: "Submission 1" }, //dummy submissions
        { id: 2, name: "Submission 2" },
        { id: 3, name: "Submission 3" },
        { id: 4, name: "Tester "      },
        { id: 5, name: "Alex Jackson "},
        { id: 6, name: "Submission 6"},
    ]); // List of submissions


    const [buttonStates, setButtonStates] = useState([]); // List of button (lock) states
      
    const handleCheckbox = (index) => {
        const lockID = `lock_${submissions[index].id}`;

        databaseAdmin.ref(`locks/${lockID}`).set({
            state: !buttonStates[index]
        });

        setButtonStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = !newStates[index];
        return newStates;
        });
    };

    useEffect(() => {
        const getStates = async () => {
            const newButtonStates = await Promise.all(
                submissions.map(async (submission) => {
                    const lockID = `lock_${submission.id}`;
                    const dbStates = await databaseAdmin.ref(`locks/${lockID}`).get();
                    const curStates = dbStates.val();
                    return curStates ? curStates.state : false;
                })
            );
            setButtonStates(newButtonStates);
        };
        getStates();
    }, []);

const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //NOT YET WORKING; CODE FOR HANDLING SEARCHBAR INPUTS
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const input = event.target.value.toLowerCase();


    /*TESTS FOR RETRIEVING DATA FROM DB
    database.child('users').orderByChild('email').equalTo(input).once('value')
        .then((snapshot) => {
            const results = [];
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if(user.email.toLowerCase().includes(input)) {
                    results.push(user);
                }
            });
            setSearchResults(results);
        })
        .catch((error) => {
            console.error('Error searching by email:', error);
        });
    */
    
    /*
    database.child('users').orderByChild('fullName').equalTo(input).once('value')
        .then((snapshot) => {
            const results = [];
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if(user.fullName.toLowerCase().includes(input)) {
                    results.push(user);
                }
            });
            setSearchResults(results);
        })
        .catch((error) => {
            console.error('Error searching by Full Name:', error);
        });
    
  };
  */


  //REMOVE ${submission.id} FROM SUB BOX TO GET LINK TO SUBAPPFORM WORKING; id is for when there are real submissions to pull forms from
}
    return (
   
    <div class="wrapper-admin-portal" id="adminPortalWrapper" onLoad="javascript:onAuthStateChanged(adminAuth, adminAuth.currentUser)">
         
         <a href="/adminlogin"><button class="logout">Logout</button></a>
        <p class="fs-1 adminportal-heading">
            <p class="text-center">Current Applicants</p>
            <p class="text-end">
                <p class="fs-6">
                </p>
            </p>
        </p>
        <div class="row g-2">
            <div class="col-md col-md-admin1">
                <div class="form-floating form-floating-custom">
                    <select class="form-select form-admin" id="floatingSelect" aria-label="Filter drop down menu">
                        <option selected>Filter by grant, date, read/unread</option>
                        <option value="grant">grant 1</option>
                        <option value="grant2">grant 2</option>
                        <option value="date">date</option>
                        <option value="read">read</option>
                        <option value="unread">unread</option>
                    </select>
                </div>
            </div>
        
            <div class="col-md col-md-admin2">
                
                <div class="mb-3 search-bar search-admin">
                    <div class="searchField">
                        <input type="name" class="form-control" id="searchBar" placeholder="Search for applicants" onChange={handleSearch}></input> 
                        <button class="search">Search</button>
                    </div>
                </div>
            </div>

            <div>
                {searchResults.map((user) => (
                    <div key = {user.email} class = 'user-result'>
                        <p>email: {user.email}</p>
                        <p>full name: {user.fullName}</p>
                    </div>
                ))}
            </div>
        </div>
       
        <div className="submissions-box">
            {submissions.map((submission, index) => (
                <div key={index}>
                <button className="sub" disabled={buttonStates[index]}>
                    {buttonStates[index] ? (
                    <span className="submission-link">Submission</span>
                    ) : (
                    <a className="submission-link" href={`/adminsubappform/${submission.id}`}> 
                        {submission.name}
                    </a>
                    )}
                </button>
                <label className="switch">
                    <input
                    type="checkbox"
                    onChange={() => handleCheckbox(index)}
                    checked={buttonStates[index]}
                    />
                    <span className="slider round"></span>
                </label>
                </div>
            ))}
        </div>

        
    </div>
    )
  }

/*
export function AdminPortal() {


    const search = () => {
        let sBar = document.getElementById("input").value.toUppercase();
        let myTable = document.getElementById('');
        let tag = myTable.getElementsByTagName('tag'); //
        
        for(var i = 0; i < tag.length;i++){
            let tag = tag[i].getElementsByTagName('')[1];
            if(tag){
                let textval = tag.textContent || tag.innerHTML;
                if(textval.toUppercase().indexOf(sBar) > -1){
                    tag[i].style.display = "";
                }
                else{
                    tag[i].style.display = "none";
                }
            }
        }

    }
*/