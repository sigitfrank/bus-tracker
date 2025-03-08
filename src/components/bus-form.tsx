import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Box, Grid2, Typography, Divider } from '@mui/material'
import BusSelector from './bus-selector'
import { saveOrUpdateBusLocation } from '../lib/api/bus.api'
import { toast } from 'react-toastify'
import { Logout } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../lib/store/app-store'

const BusForm = () => {
    const { user } = useAppStore()
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: { busName: '' },
        validationSchema: Yup.object({
            busName: Yup.string().required('Bus name is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await saveOrUpdateBusLocation({
                    name: values.busName,
                    coordinates: [0, 0]
                })
                toast.success("Bus registered!")
                resetForm()
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error('An unexpected error occurred')
                }
            }
        },
    })

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <Grid2 container justifyContent="center" sx={{
            minHeight: '100svh',
        }}>
            <Grid2 size={{
                md: 6,
                xs: 12
            }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: '16px'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography>Hi, {user?.name}</Typography>
                    <Button color='error' onClick={handleLogout}>
                        <Logout /> Logout
                    </Button>
                </Box>
                <Divider />
                {
                    user?.role === 'driver' && <Box component='form' onSubmit={formik.handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                        <TextField
                            label='Bus Name'
                            variant='outlined'
                            name='busName'
                            value={formik.values.busName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.busName && Boolean(formik.errors.busName)}
                            helperText={formik.touched.busName && formik.errors.busName}
                            fullWidth
                        />
                        <Button type='submit' variant='contained' color='primary' sx={{
                            minWidth: 'fit-content'
                        }}
                            loading={formik.isSubmitting}
                        >
                            Register New Bus
                        </Button>
                    </Box>
                }

                <Box sx={{
                    border: '1px solid #DDD',
                    borderRadius: '4px',
                    padding: 2
                }}>
                    <BusSelector />
                </Box>
            </Grid2>
        </Grid2>
    )
}

export default BusForm
