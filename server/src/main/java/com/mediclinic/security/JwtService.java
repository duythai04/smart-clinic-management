package com.mediclinic.security;

import com.mediclinic.user.entity.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;

    private final long expiration;

    public JwtService(

        @Value("${app.security.jwt.secret}")
        String secret,

        @Value("${app.security.jwt.expiration}")
        long expiration

    ) {

        this.signingKey = Keys.hmacShaKeyFor(
            Decoders.BASE64.decode(secret)
        );

        this.expiration = expiration;
    }

    public String generateToken(User user) {

        Date now = new Date();

        Date expiresAt = new Date(
            now.getTime() + expiration
        );

        return Jwts.builder()

            .subject(user.getId().toString())

            .issuer("mediclinic")

            .issuedAt(now)

            .expiration(expiresAt)

            .signWith(signingKey, Jwts.SIG.HS256)

            .compact();
    }

    public Long extractUserId(String token) {

        String subject = Jwts.parser()

            .verifyWith(signingKey)

            .requireIssuer("mediclinic")

            .build()

            .parseSignedClaims(token)

            .getPayload()

            .getSubject();

        return Long.valueOf(subject);
    }

    public long getExpirationSeconds() {

        return expiration / 1000;
    }
}