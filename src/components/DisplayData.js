import { Button } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'
import MyDataTable from './DataTable'
export default function DisplayData() {
  return (
    <>
    <div>
        <Container>
            <div style={{margin:'10px', padding:'5px', }}>
              <Link to={"/add"} style={{textDecoration:'none'}}>
            <Button style={{border:'1px solid',
                 borderColor:'olivedrab'
            }}     
            variant='contained' >Add Expiry Data</Button>
            </Link>
            <hr style={{marginTop:'20px', borderColor:'orangered',}}/>
            </div>
    <div>
      <MyDataTable/>
    </div>
        </Container>
        
    </div>
    </>
  )
}
