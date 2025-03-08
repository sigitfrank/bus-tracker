import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField, MenuItem, Button, Box, Grid2, Typography, Divider } from '@mui/material'
import { User } from '../lib/types/user.type'
import useAppStore from '../lib/store/app-store'
import { useNavigate } from 'react-router-dom'
import { saveOrUpdateUserLocation } from '../lib/api/user.api'
import { toast } from 'react-toastify'
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    role: Yup.string().oneOf(['driver', 'passenger'], 'Invalid role').required('Role is required')
})
const LoginForm = () => {
    const { setUser } = useAppStore()
    const navigate = useNavigate()
    const handleSubmit = async (data: unknown) => {
        try {
            const user = data as User

            const res = await saveOrUpdateUserLocation({
                name: user.name,
                role: user.role,
                coordinates: [0, 0],
            })
            setUser(res as User)
            localStorage.setItem('user', JSON.stringify(res))
            navigate('/')
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('An unexpected error occurred')
            }
        }
    }
    return <Grid2 container justifyContent="center" sx={{
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
            <Formik
                initialValues={{ name: '', role: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Box display='flex' flexDirection='column' gap={2}>
                            <Typography sx={{ textAlign: 'center' }}>Please input role correctly</Typography>
                            <Divider />
                            <Field
                                as={TextField}
                                name='name'
                                label='Name'
                                error={touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                fullWidth
                            />
                            <Field
                                as={TextField}
                                name='role'
                                label='Role'
                                select
                                error={touched.role && !!errors.role}
                                helperText={touched.role && errors.role}
                                fullWidth
                            >
                                <MenuItem value='driver'>Driver</MenuItem>
                                <MenuItem value='passenger'>Passenger</MenuItem>
                            </Field>
                            <Button type='submit' variant='contained' color='primary' loading={isSubmitting}>Submit</Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Grid2>
    </Grid2>
}

export default LoginForm