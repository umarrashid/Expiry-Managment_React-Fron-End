import React,{ useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button,Typography } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddData () {
    
       const[brandName, setBrandName] = useState("");
       const[supplierName, setSupplierName] = useState("");
       const[expiryDate, setExpiryDate] = useState(new Date());
       const[brandNameError, setBrandNameError] = useState(false);
       const[supplierNameError, setSupplierNameError] = useState(false);
      // const[expiryDateError, setExpiryDateError] = useState(false);

       const expiryObject = {brandName, supplierName, expiryDate};

    // getting value form inputs with onchnage function

     const disable = brandName.length === 0 || supplierName.length === 0;
     
   const brandNameGetValue = (e)=>{ 
        setBrandName(e.target.value.toUpperCase());
   }
     
   const supplierNameGetValue = (e)=>{
       setSupplierName(e.target.value.toUpperCase());
   }
  
  //  useEffect(()=>{
  //     checkAllInputs();
  //  },[brandName])
      
    // on Blur
    const brandNameBlur = ()=>{
      if(brandName === ""){
        setBrandNameError(true);
      }
      // checkAllInputs();
    }

    const supplierNameBlur = ()=>{
      if(supplierName.length === 0){
        setSupplierNameError(true);
      }
    }

    // const expiryDateBlur = ()=>{
    //   if(expiryDate.length === 0){
    //     setExpiryDateError(true);
    //   }
    // }
     // onFocus
     const brandNameFocus = ()=>{
      setBrandNameError(false);
     }
        
     const supplierNameFocus = ()=>{
      setSupplierNameError(false);
     }

    //  const expiryDateFocus = ()=>{
    //   setExpiryDateError(false);
    //  }
          const myToast = ()=>{
        toast.success("Data is Saved !",{
            position:toast.POSITION.TOP_CENTER,
        });
       }
       const clearStats = ()=>{
        setBrandName('');
        setSupplierName('');
        setExpiryDate(new Date());
        myToast();
       }

       const addData = (e)=>{
        e.preventDefault();
        fetch("http://localhost:8080/add",{
          method:"POST",
          headers:{'Content-type': 'application/json; charset=UTF-8',},
          body:JSON.stringify(expiryObject),
        })
        .then((response)=>clearStats())
        .catch((error)=>console.log(error));
       }

  return (
    <div>
        <Container>
        <ToastContainer autoClose={3000} />
        <div style={{textAlign:'center', margin:'10px'}}>
            <Typography variant='h5'>Add Data</Typography>
        </div>
        <hr style={{borderColor:'red', borderWidth:'2px', margin:'10px'}}/>
    <div style={{display:'flex', justifyContent:'center'}}>
    <Box 
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
    {/* <Stack spacing={2}> */}
      <TextField  fullWidth id="productName" label="Product Name" 
      value={brandName.toLowerCase()} variant="outlined" 
       onChange={brandNameGetValue}
       onBlur={brandNameBlur}
      error={brandNameError}
      helperText={brandNameError ? "Enter Brand Name" :""}
      onFocus={brandNameFocus}
      />
      <TextField id="supplierName"  label="Supplier Name"
      onBlur={supplierNameBlur}
      error={supplierNameError}
      onFocus={supplierNameFocus}
      onChange={supplierNameGetValue}
      helperText={supplierNameError ? "Enter Supplier Name" : ""}
       value={supplierName.toLowerCase()} variant="outlined"
     />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
          label="Date Expiry"
          inputFormat="MM/DD/YYYY"
          value={expiryDate}
        // onBlur={expiryDateBlur}
        // onFocus={expiryDateFocus}
        // error={expiryDateError}
        // helperText={expiryDateError ? "Enter Date of Expiry" : ""}
          onChange={(data)=>{setExpiryDate(data.format("MM/DD/YYYY"))}}
          renderInput={(params) => <TextField {...params} />}
        />
     </LocalizationProvider>
      <Button type='button' variant='contained' id="submitButton" disabled={disable}
      style={{backgroundColor:'orangered',marginTop:'10px',}} onClick={addData}>Add Data</Button>
      {/* </Stack> */}
    </Box>
    </div>
   
    </Container>
    </div>
  )
};
