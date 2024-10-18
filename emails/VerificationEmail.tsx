import * as React from 'react';
import { Html, Button, Body, Container, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Body style={{ margin: 0, padding: 0 }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #eaeaea', borderRadius: '5px' }}>
                    <h2>Hello {username},</h2>
                    <Text>Thank you for registering! Please use the following verification code to verify your email:</Text>
                    <h3 style={{ fontWeight: 'bold' }}>{otp}</h3>
                    <Text>If you didn’t create an account, you can safely ignore this email.</Text>
                    <Button href={""} style={{ marginTop: '20px' }}>
                        Verify My Email
                    </Button>
                </Container>
            </Body>
        </Html>
    );
}
