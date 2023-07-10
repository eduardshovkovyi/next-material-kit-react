import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "../hooks/use-auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import SnackBarComponent from "../components/alert";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useDataContext } from "src/providers/docs-provider";
import { SnackbarContext } from "src/contexts/snackbar-context";
import "firebase/functions";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const Page = () => {
  const router = useRouter();
  const { data } = useDataContext();

  const { showSuccess, showError, openSnackbar, message, isError } =
    useContext(SnackbarContext);

  const userUID = JSON.parse(window.localStorage.getItem("user"))?.uid;

  useEffect(() => {
    if (data?.length && !data?.isAdmin) {
      router.push("/");
    }
  }, [data, router]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(30).required("Name is required"),
      email: Yup.string()
        .email("Must be a valid email")
        .max(30)
        .required("Email is required"),
      password: Yup.string().max(30).min(6).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      const addAdminRole = httpsCallable(functions, "createUser");
      addAdminRole({
        uid: userUID,
        email: values?.email,
        password: values?.password,
        full_name: values?.name,
      })
        .then((result) => {
          console.log("result", result);
          if (result?.data?.isCreated) {
            showSuccess();
            helpers.resetForm();
          } else {
            showError(result?.data?.message);
          }
        })
        .catch((error) => {
          showError(error);
        });
    },
  });

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Registration
              </Button>
            </form>
          </div>
        </Box>
      </Box>
      {openSnackbar && (
        <SnackBarComponent message={message} isError={isError} />
      )}
    </>
  );
};

Page.getLayout = (page, isDarkMode, setDarkMode) => (
  <DashboardLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
    {page}
  </DashboardLayout>
);

export default Page;
