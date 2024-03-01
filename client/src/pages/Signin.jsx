import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { signInStart, signInSuccess , signInFailure } from '../redux/user/userSlice'

function Signin() {

  const [formData , setFormdata] = useState({})
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()


    const handleChange = (e)=>{
      setFormdata({
        ...formData,
        [e.target.id] : e.target.value,
    })
    }

    // console.log(formData);


    const handleSubmit = async (e)=>{
      e.preventDefault() // Prevent page Refresh

      try {
        // setLoading(true)
        dispatch(signInStart())
  
        const res = await fetch('/server/auth/signin',{
          method:'POST',
          headers:{
            'Content-type' : 'application/json',
          },
          body: JSON.stringify(formData)
        })
  
        const data = await res.json()
        console.log(data);

        if(data.success === false)
        {
          // setLoading(false)
          // setError(data.message)
          dispatch(signInFailure(data.message))
          return
        }
        // setLoading(false)
        // setError(null)
        dispatch(signInSuccess(data))
        navigate('/')
      } catch (error) {
        // setLoading(false)
        // setError(error.message)
        dispatch(signInFailure(data.message))
      }

    } // handleSubmit

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} action="" className='flex flex-col  gap-5'>

        <input type="text" placeholder='Email' id='email'className='border p-3 rounded-lg' onChange={handleChange} />

        <input type="text" placeholder='Password' id='password'className='border p-3 rounded-lg' onChange={handleChange} />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>

      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
        <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>
        {error}</p>}

    </div>
  )
}

export default Signin