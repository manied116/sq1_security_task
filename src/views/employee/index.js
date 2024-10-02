import React,{useState,useEffect} from 'react'
// NPM
import { toast,ToastContainer } from 'react-toastify';

// MUI COMPONENTS
import Grid             from '@mui/material/Grid2';
import Stack            from '@mui/material/Stack';
import Fab              from '@mui/material/Fab';
import TextField        from '@mui/material/TextField';
import InputLabel       from '@mui/material/InputLabel';
import MenuItem         from '@mui/material/MenuItem';
import FormControl      from '@mui/material/FormControl';
import FormHelperText   from '@mui/material/FormHelperText';
import Select           from '@mui/material/Select';
import Button           from '@mui/material/Button';
import Tooltip          from '@mui/material/Tooltip';
import Dialog           from '@mui/material/Dialog';
import DialogTitle      from '@mui/material/DialogTitle';
import DialogContent    from '@mui/material/DialogContent';
import DialogActions    from '@mui/material/DialogActions';
import IconButton       from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
// MUI LAB
import LoadingButton from '@mui/lab/LoadingButton';

// DATAGRID
import { DataGrid } from '@mui/x-data-grid';

// ICON
import AddIcon    from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon  from '@mui/icons-material/Close';
import SaveIcon   from '@mui/icons-material/Save';

// COMMON
import { validate } from '../../assets/js/common';
// API
import { getEmployees,addEmployee,getEmployeeById,updateEmployee,deleteEmployee } from '../../api/apiService';

const Employee = () => {

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5,});
  const [isLoad,setIsLoad]                    = useState(true);
  const [formData,setFormData ]               = useState({});
  const [formError, setFormError ]            = useState({});
  const [empTblData,setEmpTblData]            = useState([])
  const [mode,setMode]                        = useState('ADD');
  const [rowId,setRowId]                      = useState('');
  const [deleteId,setDeleteId]                = useState([]);
  const [openForm,setOpenForm]                = useState(false);
  const [btnLoading,setBtnLoading]            = useState(false);

  //TABLE COLUMNS 
  const empColumns = [
    { field: 'empId', headerName: 'Employee Id',flex:1 },
    { field: 'name', headerName: 'Name',flex:1 },
    { field: 'email', headerName: 'Email', flex:1},
    { field: 'mobile', headerName: 'Mobile', flex:1},
    { field: 'role', headerName: 'Role', flex:1},
  ];

  // ROLE INFO
  const Role = ["Designer","Developer","Tester"]

  useEffect(() => {
    fetchEmployees()
  },[])

  // INITIALLY FETCH EMPLOYEE INFO
  const fetchEmployees = async () => {
    var response = await getEmployees()
    if(response.status === 200){
      setEmpTblData(response.data);
      setIsLoad(false)
    }else{
      toast.error('Unable to fetch the data');
    }
  };

  // HANDLE ADD , UPD AND CLOSE
  const getFormData = async(pro_data) =>{
    var mode = pro_data.mode;
    if(parseInt(mode) === 1){ // ADD OPEN
      setOpenForm(true)
      setFormData({})
      setMode('ADD')
    }else
    if(parseInt(mode) === 2){
      
      // GET ROW DATA
      var response = await getEmployeeById(pro_data.data.id);
      if(response.status === 200){
        setFormData(response.data)
        setOpenForm(true)
        setMode('UPD')
        await setRowId(pro_data.data.id)
      }else{
        toast.error('Unable get data');
      }
    }else
    if(parseInt(mode) === 3){ //CLOSE MODAL
      setOpenForm(false)
    }
  }

  // INPUT ONCHANGE
  const handleOnchange = async(event) =>{
    var form_data = {...formData};
    var value     = event.target.value;
    var name      = event.target.name;
    form_data[name] = value
    await setFormData(form_data)
  }

  // ADD / UPD EMPLOYEE
  const submitForm = async(e) =>{
    e.preventDefault();
    setBtnLoading(true)
    const validationErrors = validate(formData);
    // VALIDATE ALL INPUT'S ARE FILLED OR ELSE THROW AN ERROR
    if (Object.keys(validationErrors).length > 0) {
      setFormError(validationErrors);
      setBtnLoading(false)
    }else {
      if(mode === "ADD"){
        var response = await addEmployee(formData)
        console.log(response)
        if(response.status === 201){
          // UPDATE TABLE
          fetchEmployees();
          setFormError({})
          setOpenForm(false)
          setBtnLoading(false)
          toast.success('Employee added successfully');
        }else{
          setBtnLoading(false)
          toast.error('Failed to add employee');
        }
      }else
      if(mode === "UPD"){
        var updResponse = await updateEmployee(rowId,formData);
        if (updResponse.status === 200) {
          // UPDATE TABLE
          fetchEmployees();
          setFormError({})
          setOpenForm(false)
          setBtnLoading(false)
          toast.success('Employee updated successfully');
        }else{
          setBtnLoading(false)
          toast.error('Failed to upd employee');
        }
      }
    }
  }

  // GET DELETE ID
  const getDeleteId = (id) =>{
    setDeleteId(id)
  }

  // DELETE ROW DATA
  const deleteRowData = async() =>{
    const response = await deleteEmployee(deleteId[0]);
    if (response.status === 200) {
      fetchEmployees();
      toast.success(`${deleteId[0]} deleteed successfully`);
    }else{
      toast.error('Failed to upd employee');
    }
  }

  if(isLoad){
    return (
      <Grid container style={{display:"flex",justifyContent:"center",marginTop:"10%"}}>
        <CircularProgress />
      </Grid>
    )
  }else{
    return (
      <Grid container spacing={2} className="wrapper">
        <Grid size={{ xs: 12, md: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Stack
                useFlexGap
                spacing   = {{ xs: 1, sm: 2 }}
                direction = "row"
                sx        = {{ flexWrap: 'wrap',justifyContent: "space-between", }}
              >
                <h3>Employee</h3>
                <div className='actions'>
                  {deleteId.length > 0 ? 
                    <Tooltip title="Delete">
                      <Fab size="small" color="error" aria-label="delete" onClick={()=>deleteRowData()}>
                        <DeleteIcon />
                      </Fab>
                    </Tooltip>
                  :null
                  }
                  <Tooltip title="Add">
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>getFormData({mode:1})}>
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </div>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <DataGrid 
                rows                        = {empTblData} 
                columns                     = {empColumns} 
                pageSizeOptions             = {[5, 10, 25]}
                rowCount                    = {empTblData.length}
                paginationMode              = "client"
                paginationModel             = {paginationModel}
                onPaginationModelChange     = {setPaginationModel}
                disableRowSelectionOnClick  = {true}
                onRowClick                  = {(params, event) => getFormData({mode:2,data:params})}
                checkboxSelection
                onRowSelectionModelChange   = {(record)=>getDeleteId(record)}
                disableMultipleRowSelection = {true}
              />
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth        = "lg"
          onClose         = {()=>getFormData({mode:3})}
          aria-labelledby = "employee-title"
          open            = {openForm}
          className       = 'employee_action'
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="employee-title">
            Add Employee
          </DialogTitle>
          <IconButton
            aria-label = "close"
            onClick    = {()=>getFormData({mode:3})}
            sx         = {(theme) => ({ position: 'absolute', right: 8, top: 8,})}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Grid container spacing={2} className='form_holder'>
              <Grid size={{ xs: 12, md: 12 }} className='form_info'>
                <Grid container style={{padding:"16px"}} spacing={{ xs: 2, md: 2}} columns={{ xs: 4, sm: 8, md: 12 }}>
                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <TextField 
                      fullWidth
                      autoComplete = 'off'
                      id           = "empId"
                      name         = "empId"
                      label        = "Employee Id"
                      value        = {formData.empId ? formData.empId : ""}
                      onChange     = {(event) => handleOnchange(event)}
                      helperText   = {formError.empId ? formError.empId : ""}
                      error        = {formError.empId ? true : false}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 3}}>
                    <TextField 
                      fullWidth
                      autoComplete = 'off'
                      id           = "name"
                      name         = "name"
                      label        = "Name"
                      value        = {formData.name ? formData.name : ""}
                      onChange     = {(event) => handleOnchange(event)}
                      helperText   = {formError.name ? formError.name : ""}
                      error        = {formError.name ? true : false}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <TextField 
                      fullWidth
                      autoComplete = 'off'
                      id           = "email"
                      name         = "email"
                      label        = "Email"
                      value        = {formData.email ? formData.email : ""}
                      onChange     = {(event) => handleOnchange(event)}
                      helperText   = {formError.email ? formError.email : ""}
                      error        = {formError.email ? true : false}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                    <TextField 
                      fullWidth
                      autoComplete = 'off'
                      id           = "mobile"
                      name         = "mobile"
                      label        = "Mobile"
                      value        = {formData.mobile ? formData.mobile : ""}
                      onChange     = {(event) => handleOnchange(event)}
                      helperText   = {formError.mobile ? formError.mobile : ""}
                      error        = {formError.mobile ? true : false}
                    />
                  </Grid>
                  <Grid size={{xs: 6, sm: 3, md: 3 }} >
                    <FormControl fullWidth error={formError.role}>
                      <InputLabel id="role">Role</InputLabel>
                      <Select
                        labelId  = "role"
                        id       = "role"
                        name     = "role"
                        value    = {formData.role ? formData.role : ""}
                        label    = "Role"
                        onChange = {(event) => handleOnchange(event)}
                      >
                        {Role && Role.length > 0 && Role.map((role,index)=>(
                          <MenuItem key={index} value={role}>{role}</MenuItem>
                        ))}
                      </Select>
                      {formError.role ? (
                        <FormHelperText>{formError.role}</FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row" style={{marginTop:"6px"}}>
              <Button variant="outlined" className='cancel_btn' color='error' onClick={()=>getFormData({mode:3})}>Cancel</Button>
              <LoadingButton 
                loading={btnLoading}
                variant="outlined" 
                color='success' 
                onClick={submitForm}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                className='submit_btn'
              >{btnLoading ? "Processing" : "Submit"}</LoadingButton>
            </Stack>
          </DialogActions>
        </Dialog>
        <ToastContainer closeOnClick/>
      </Grid>
    )
  }
}

export default Employee
