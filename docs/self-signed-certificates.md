# Certificates

Instructions for creating self-signed certificates for local dev environments.

## Root CA

To set up a root certificate authority on your local dev machine,

1. Create a key for the root CA: `openssl genrsa -out rootCA.key 4096`
1. Self-sign the root CA key: `openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt`. **TIP:** Set the "Common Name" and "Organization Name" to something you will recognize, because that's what shows up in the list of trusted authorities.
1. Trust the root CA key (process varies by platform and browser).

## Individual certificates

These instructions are for creating a key/cert pair for a host named `example.localhost`.

1. Generate a private key: `openssl genrsa -out example-localhost.key 2048`
1. Create a config file `example-localhost.conf`, setting the value in the last line to your hostname.
```
[ req ]
default_bits       = 4096
distinguished_name = req_distinguished_name
req_extensions     = req_ext

[ req_distinguished_name ]
countryName                 = Country Name (2 letter code)
countryName_default         = US
stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = Stateless
localityName                = Locality Name (eg, city)
localityName_default        = Crazytown
organizationName            = Your Name (eg, Alex)
organizationName_default    = Alex
commonName                  = Common Name (e.g. server FQDN or YOUR name)
commonName_max              = 64
commonName_default          = example

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = example.localhost
```
3. Create a signing request for the key. **_IMPORTANT:_ Make sure that you set "Common Name" to your hostname.** `openssl req -new -sha256 -key example-localhost.key -out example-localhost.csr -config ssl.conf`
  - You can verify the CSR with `openssl req -text -noout -in example-localhost.csr`
4. Sign the certificate with the root CA: `openssl x509 -req -in example-localhost.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out example-localhost.crt -days 1024 -sha256 -extensions req_ext -extfile example-localhost.conf`
5. Move the certificate and key to a location where they can be accessed by the webserver and update the server configuration.

## Diffie-Hellman Key

To generate a Diffie-Hellman key in the same directory: `openssl dhparam -out dhparam-2048.pem 2048`
