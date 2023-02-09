import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import avatar from '../assets/profile.png';
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'

import styles from '../styles/Register.module.css';

export default function Reset() {

  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] = useFetch('createResetSession')

  const formik = useFormik({
    initialValues : {
      password : '',
      confirm_pwd: ''
    },
    validate : resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      
      let resetPromise = resetPassword({ username, password: values.password })

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });

      resetPromise.then(function(){ navigate('/password') })

    }
  })


  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width : "30%"}}>

          <div className="title flex flex-col items-center py-4">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='pt-2 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          <form onSubmit={formik.handleSubmit}>
          <div className='profile flex justify-center py-4'>
                  <img src={avatar} className={styles.profile_img} alt="avatar" />
              </div>


              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='New Password' />
                  <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="password" placeholder='Repeat Password' />
                  <button className={styles.btn} style={{paddingBottom:10}} type='submit'>Reset</button>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}
