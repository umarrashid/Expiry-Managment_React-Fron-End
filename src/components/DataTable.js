import React,{ useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Slider from '@mui/material/Slider';
import { Edit } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, selectClasses } from '@mui/material';

export default function MyDataTable() {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    marginBottom:'30px',
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [secondModelOpen, setSecondModelOpen] = useState(false)

  const secondModelOpenHandle = ()=>{
    setSecondModelOpen(true);
  }

  const secondModelCloseHandle = ()=>{
    setSecondModelOpen(false);
  }
  const [getAlldata, setAllData] = useState([]);
   const [selectDays, setSelectDays] = useState(0);
   
   const[getSelectedRowData, setSelectedRowData] = useState({
                                                    id:'',
                                                    brandName:'',
                                                    supplierName:'',
                                                    expiryDate:''
                                                  });
      const [deleteOneRecord, setDeleteOneRecord] = useState("");

      const [filterData, setFilterData] = useState([]);

      const [searchFilter, setSearchFilter] = useState('');

   const handleChange = (event, newValue)=>{
      setSelectDays(newValue);  
   }

   const searchBrandName = (event)=>{
      setSearchFilter(event.target.value);
      
   }
   // this useeffect can search the brand name
   useEffect(()=>{
      if(searchFilter === ''){
        setFilterData(getAlldata);
      }else{
        const searchResult = getAlldata.filter((item)=>
        {
          return(item.brandName.toLowerCase().includes(searchFilter.toLowerCase()));
        });
        setFilterData(searchResult);
      }
   },[searchFilter, getAlldata])
   // this useEffect will filter the data and reload as we change the range
   useEffect(()=>{

   if(selectDays === 0 ){
    setFilterData(getAlldata);
   }else{
    const daysData = getAlldata.filter((item)=> 
    { 
      return(item.remaingDays <= selectDays );
      
    });
    
     
    setFilterData(daysData);
    console.log(daysData);
   }
   

 },[selectDays, getAlldata]);
   
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'brandName', headerName: 'Brand Name',width:250 },
    { field: 'supplierName', headerName: 'Supplier Name', width: 250 },
    {
      field: 'expiryDate',headerName: 'Expiry Date',width: 130,
    },
    {
      field: 'remaingDays',headerName: 'Remaing Days',width: 130,
   
    },
    {
    field: 'action',
    headerName: 'Actions',
    width:170,
    renderCell:(params)=>{
      return(
          <div>
          <IconButton onClick={()=>{setSelectedRowData(
            {
              id:params.row.id,
              brandName:params.row.brandName,
              supplierName:params.row.supplierName,
              expiryDate:params.row.expiryDate
            }
          )
           ;handleOpen()}}>
            <Edit sx={{
              fontSize:'30px', 
               color:'#C0C0C0',
              padding:'3px'}}/>
            </IconButton>
          <IconButton onClick={()=>{setDeleteOneRecord(params.row.id); secondModelOpenHandle()}}>
              <DeleteIcon sx={{fontSize:'30px', color:'#rrr',padding:'3px'}}/>
          </IconButton>
        
          </div>
     
      )
      }
    
  },
  ];
  
  
  const updateData = (e)=>{
    
     const dataId = getSelectedRowData.id;
     
    fetch("http://localhost:8080/update/"+dataId,{
    method:"PUT",
    headers:{'Content-type': 'application/json; charset=UTF-8',},
    body:JSON.stringify(getSelectedRowData),

    })
    .then((respons)=>console.log(respons.json()))
    .catch((error)=> console.log(error))

  }


  // useEffect(()=>{

  //   if(deleteOneRecord){
  //     deleteOneEntry()
  //   }
  // },[deleteOneRecord]);
  
  

  const deleteOneEntry = ()=>{
   
      fetch("http://localhost:8080/delete/"+deleteOneRecord,{
        method:"DELETE",
        headers:{'Content-type': 'application/json; charset=UTF-8',},
        
      })
      .then((response)=>console.log(response))
      .catch((error)=>console.log(error));
  }


  useEffect(()=>{
     fetch("http://localhost:8080/getAllData")
     .then((response)=>response.json())
     .then((data)=>{
      let currentDate = new Date();
      const currentDateMilliseconds = currentDate.getTime();
      const oneDay = 1000 * 60 * 60 * 24;

         const convertdData = data.map((myData)=>{
         const dateStringConverert = new Date(myData.expiryDate);
         const dateStringMilliSeconds = dateStringConverert.getTime();
         const difference = dateStringMilliSeconds - currentDateMilliseconds;
         const remaingDays = Math.round(difference / oneDay);
         return({
          "id":myData.id,
          "brandName":myData.brandName,
          "supplierName":myData.supplierName,
          "expiryDate":myData.expiryDate,
          "remaingDays":remaingDays,
          "className":remaingDays < 60 ? "red" : "",
         });
      })
      setAllData(convertdData);
       setFilterData(convertdData);
     })
     .catch((error)=>console.log(error));
  },[]);

 

  return (
    <>
     <Card  style={{marginBottom:'15px'}}
     variant="outlined">
     <CardContent>
     <div style={{margin:'10px'}}>
      <h2>Select Range Between Expiry Dates</h2>
    </div>
    <div style={{margin:'10px'}}>
    <Slider
    aria-label="Select Days Range" 
    value={selectDays} 
    onChange={handleChange} 
    defaultValue={60}
    
    valueLabelDisplay="auto"
    step={30}
    marks
    min={0}
    max={180}/>
    </div>
     </CardContent>
     </Card>
    
     <Card  style={{marginBottom:'15px'}}
     variant="outlined">
     <CardContent>
     <div style={{margin:'10px', }}>
      <h2>Search By Brand Name</h2>
    </div>
    <div style={{margin:'10px', }}>
     <TextField label="Brand Name Search"
     value={searchFilter}
     onChange={searchBrandName}
     
     />
    </div>
     </CardContent>
     </Card>
    <div style={{ height: 2750, width: '100%', marginBottom:'30px', }}>
      <DataGrid
       sx={{
        '& .MuiDataGrid-row:hover': {
          color: 'red',
        },
       }}
        rows={filterData}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[50]}
        getRowClassName={(params)=> params.row.remaingDays < selectDays ? 'classRed':''}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: 'id',
                sort: 'desc',
              },
            ],
          },
        }}
        // checkboxSelection
        disableSelectionOnClick={true}
      />
    </div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Data
          </Typography>
          <hr style={{marginTop:'20px', borderColor:'orangered',}}/>
          <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '100%' },
      }}
     
      autoComplete="off"
    >
      <TextField fullWidth id="id" label="Id"
       variant='outlined' value={getSelectedRowData.id} disabled/>
      <TextField  fullWidth id="productName" label="Product Name" 
       variant="outlined" 
       value={getSelectedRowData.brandName}
      onChange={(event)=>setSelectedRowData(
        {
          ...getSelectedRowData,
          brandName:event.target.value.toUpperCase()
        }
      )}
    />

      <TextField id="supplierName"  label="Supplier Name" 
       variant="outlined" 
       value={getSelectedRowData.supplierName}
     onChange={(event)=> setSelectedRowData({
        ...getSelectedRowData,
        supplierName:event.target.value.toUpperCase()
     })}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
          label="Date Expiry"
          inputFormat="MM/DD/YYYY"
          value={getSelectedRowData.expiryDate}
         onChange={(selectedDate)=> setSelectedRowData({
          ...getSelectedRowData,
         expiryDate: selectedDate.format("MM/DD/YYYY")})}
          renderInput={(params) => <TextField {...params} />}
        />
     </LocalizationProvider>
     <Button type='submit' onClick={updateData}
     variant='contained' color='success'>Update Data</Button>
     <Button type='button' onClick={handleClose}
      variant='contained' color='error'>Cancle</Button>
    </Box>
        </Box>
      </Modal>

      <Modal
        open={secondModelOpen}
        onClose={secondModelCloseHandle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are You Sure to Delete Data
          </Typography>
          <hr style={{marginTop:'20px', borderColor:'orangered',}}/>
          <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '100%' },
      }}
     
      autoComplete="off"
    >
      <TextField fullWidth id="id" label="Id"
       variant='outlined' value={deleteOneRecord} disabled/>
      <Button type='submit' variant='contained' color="error" onClick={deleteOneEntry}>Confirm</Button>
      <Button type='button' variant='contained' color="warning" onClick={secondModelCloseHandle}>Cancle</Button>
    </Box>
        </Box>
      </Modal>
    </>
  );
}