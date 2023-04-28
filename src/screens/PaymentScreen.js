import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform, Text, View} from 'react-native';

// import {
//   CardField,
//   useStripe,
//   useConfirmPayment,
// } from '@stripe/stripe-react-native';
import {useHyper} from '@juspay-tech/react-native-hyperswitch';
import {confirmPayment as confirmPayment1} from '@stripe/stripe-react-native';
const fetchPaymentParams = async () => {
  console.log('aashu.....->>>>');
  const response = await fetch(
    `https://u4kkpaenwc.execute-api.ap-south-1.amazonaws.com/default/create-payment-intent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 6540,
        currency: 'USD',
        confirm: false,
        authentication_type: 'no_three_ds',
        customer_id: 'SaveCard',
        capture_method: 'automatic',
      }),
    },
  );
  console.log('testtttttttttaashu.....->>>>');

  const val = await response.json();
  console.log('sdgfsdgsgsfgsfg', await response);
  return val;
};

const PaymentScreen = () => {
  const {loading2} = useConfirmPayment();
  const [loading, setLoading] = useState(true);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const initializePaymentSheet = async () => {
    const {clientSecret, ephemeralKey, customer} = await fetchPaymentParams();
    console.log('clientSecret', clientSecret, ephemeralKey, customer);
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
        email: 'jenny.rosen@example.com',
        country: 'US',
      },
    });
    console.log('error', await error);
    if (!error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);
  const {confirmPayment} = useStripe();
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };
  const handlePayPressforCardfield = async () => {
    const billingDetails = {
      email: 'jenny.rosen@example.com',
    };
    // Fetch the intent client secret from the backend
    const {clientSecret} = await fetchPaymentParams();
    console.log('clientSecret', clientSecret);
    const {paymentIntent, error} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails,
      },
    });

    if (error) {
      Alert.alert('Payment confirmation error' + JSON.stringify(error));
      console.log('Payment confirmation error', JSON.stringify(error));
    } else if (paymentIntent) {
      Alert.alert('Payment Success');
      console.log('Success from promise', paymentIntent);
    }
  };

  const handlePayPressforKlarna = async () => {
    // Fetch the intent client secret from the backend
    const {clientSecret} = await fetchPaymentParams();
    console.log('clientSecret', clientSecret);
    const {paymentIntent, error} = await confirmPayment1(clientSecret, {
      paymentMethodType: 'Klarna',
      paymentMethodData: {
        billingDetails: {
          email: 'user-us@example.com',
          addressCountry: 'United States',
          country: 'United States',
        },
      },
    });

    if (error) {
      Alert.alert(error);
      console.log(error);
    } else if (paymentIntent) {
      Alert.alert('Payment Success');
      console.log('Success from promise', paymentIntent);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        padding: 20,
        paddingTop: 60,
      }}>
      <Text style={{color: 'gray', fontSize: 20, fontWeight: 'bold'}}>
        Pay With CardField
      </Text>
      <View style={{}}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={cardDetails => {
            console.log('cardDetails', cardDetails);
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField);
          }}
        />
      </View>
      <Button
        onPress={handlePayPressforCardfield}
        title="Pay with Card Field"
        disabled={loading2}
      />
      <Text
        style={{
          color: 'gray',
          fontSize: 20,
          fontWeight: 'bold',
          paddingTop: 50,
          paddingBottom: 20,
        }}>
        Pay With CardField
      </Text>

      <Button
        onPress={openPaymentSheet}
        title="Open PaymentSheet"
        disabled={loading}
      />
      <Text
        style={{
          color: 'gray',
          fontSize: 20,
          fontWeight: 'bold',
          paddingTop: 50,
          paddingBottom: 20,
        }}>
        Pay With Klarna
      </Text>

      <Button
        onPress={handlePayPressforKlarna}
        title="Pay Kalrna"
        disabled={loading}
      />
    </View>
  );
};
export default PaymentScreen;
