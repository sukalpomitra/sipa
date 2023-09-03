import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const App = () => {
    const [phone, setPhone] = useState("+65");
    const [hasFilled, setHasFilled] = useState(false);
    const [showMain, setShowMain] = useState(false);
    const [memberName, setMemberName] = useState("");
    const [memberId, setMemberId] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha",
            {
                size: "invisible",
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                },
            },
            auth
        );
    };

    const handleSend = (event) => {
        event.preventDefault();
        setLoading(true);
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;
        const itemsCollection = collection(db, 'members');
        const q = query(itemsCollection, where('phone', '==', phone));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        setMemberId(doc.data().memberid);
                        setMemberName(doc.data().name);
                    });
                    signInWithPhoneNumber(auth, phone, appVerifier)
                        .then((confirmationResult) => {
                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            window.confirmationResult = confirmationResult;
                            setHasFilled(true);
                            setLoading(false);
                        })
                        .catch((error) => {
                            // Error; SMS not sent
                            console.log(error);
                        });
                } else {
                    setLoading(false);
                    alert("We could not found your membership id. PLease use this link to register yourself as a member - https://docs.google.com/forms/d/e/1FAIpQLScklFF5f0GM_ADMC-49g5vaZS2Ikz8JUfVHZGEM7RG_0j-pew/viewform.")
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const verifyOtp = (event) => {
        let otp = event.target.value;
        setOtp(otp);

        if (otp.length === 6) {
            setLoading(true);
            // verifu otp
            let confirmationResult = window.confirmationResult;
            confirmationResult
                .confirm(otp)
                .then((result) => {
                    // User signed in successfully.
                    let user = result.user;
                    console.log(user);
                    alert("User signed in successfully");
                    setShowMain(true);
                    setLoading(false);
                    // ...
                })
                .catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    // ...
                    alert("User couldn't sign in (bad verification code?)");
                    setHasFilled(false);
                    setLoading(false);
                });
        }
    };

    if (!hasFilled) {
        return (
            <div className="app__container">
                <Card sx={{ width: "300px" }}>
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography sx={{ padding: "20px" }} variant="h5" component="div">
                            Hello, SIPA Member! Welcome to Durga Puja 2023.
                        </Typography>
                        <form onSubmit={handleSend}>
                            <TextField
                                sx={{ width: "240px" }}
                                variant="outlined"
                                autoComplete="off"
                                label="Mobile Number"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                            />
                            {loading ? (
                                <CircularProgress sx={{ marginTop: "20px" }} />
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: "240px", marginTop: "20px" }}
                                >
                                    Send Code
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
                <div id="recaptcha"></div>
            </div>
        );
    } else if (showMain) {
        return (
            <div className="app__container">
                <Card sx={{ width: "300px" }}>
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography sx={{ padding: "20px" }} variant="h5" component="div">
                            <h1>Hello, SIPA Member {memberName}!</h1>
                            <p>Welcome to Durga Puja 2023.</p>
                            <p>Your membership id is {memberId}</p>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="app__container">
                <Card sx={{ width: "300px" }}>
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography sx={{ padding: "20px" }} variant="h5" component="div">
                            Enter the OTP
                        </Typography>
                        <TextField
                            sx={{ width: "240px" }}
                            variant="outlined"
                            label="OTP "
                            value={otp}
                            onChange={verifyOtp}
                        />
                        {loading ? (
                            <CircularProgress sx={{ marginTop: "20px" }} />
                        ) : (<div></div>)}
                    </CardContent>
                </Card>
                <div id="recaptcha"></div>
            </div>
        );
    }
};

export default App;
