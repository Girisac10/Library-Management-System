import React from 'react'
import {BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,}
from 'react-icons/bs'
import '../App.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import 
{ BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LineChart, Line }
 from 'recharts';
 import  {useNavigate} from 'react-router-dom'


function Dashboard() {
    const [students, setStudents] = useState(0)
    const [admin, setAdmin] = useState(0)
    const [books, setBooks] = useState(0)
    const navigate = useNavigate()

  
    useEffect(() => {
      axios.get('http://localhost:8001/dashboard')
      .then(res => {
        // console.log(res)
        if(res.data.ok) {
          setStudents(res.data.student)
          setAdmin(res.data.admin)
          setBooks(res.data.book)
        } else {
          navigate('/login')
          // alert(res.data.message);
        }
      }).catch(err => {
        console.log("----")
        console.log(err)
      })
    } , [])

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
      




  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
            </div>

        <div className='main-cards'>
            <div className='card'>
            <div className='card-inner'>
                <h3>Total Books   </h3>
                <BsFillArchiveFill className='card-icon'/>
                </div>
                <h2>{books}</h2>
                </div>
                <div className='card'>
            <div className='card-inner'>
                <h3>Total Student</h3>
                <BsFillArchiveFill className='card-icon'/>
                </div>
                <h2>{students}</h2>
                </div>
                <div className='card'>
            <div className='card-inner'>
                <h3>Total Admins</h3>
                <BsPeopleFill className='card-icon'/>
                </div>
                <h2>{admin}</h2>
                </div>
                
                
                </div>

                <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
                </div>
    </main>
      
      
    
  )
}

export default Dashboard

