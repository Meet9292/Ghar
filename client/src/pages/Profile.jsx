import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePer, setFilePer] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(error.message));
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/server/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) =>{
    try {
    const res = await fetch(`/server/listing/delete/${listingId}`,{
      method:'DELETE'
    })

    const data = await res.json()

    if(data.success === false)
    {
      console.log(data.message);
      return
    }
    
    setUserListings((prev) => prev.filter(
      (listing) =>listing._id !== listingId
    ))

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt=""
        />

        <p className="text-sm  self-center">
          {uploadError ? (
            <span className="text-red-700">Error Image upload</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Success</span>
          ) : (
            ""
          )}
        </p>

        <input
          className="rounded-lg border p-3"
          id="username"
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          className="rounded-lg border p-3"
          id="email"
          defaultValue={currentUser.email}
          type="email"
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          className="rounded-lg border p-3"
          id="password"
          type="password"
          placeholder="Password"
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 uppercase disabled:placeholder-opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-90"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 p-3 rounded-lg text-center uppercase">
        {updateSuccess ? "User is updated successfully" : ""}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase">Delete</button>

                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
                </Link>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
