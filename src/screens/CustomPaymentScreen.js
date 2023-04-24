import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useStripe} from '@stripe/stripe-react-native';

const Counter = ({setPrice}) => {
  const [counter, setCounter] = useState(1);
  const priveVal = 5;
  useEffect(() => {
    setPrice(priveVal * counter);
  });
  return (
    <View
      style={{
        width: 100 + '%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
        }}>
        Meet & Greet{'  '}
        <Text style={{color: 'White', fontSize: 23}}>{priveVal}$</Text>
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            counter > 1 ? setCounter(pre => pre - 1) : null;
          }}
          style={{
            backgroundColor: 'white',
            width: 35,
            height: 35,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            paddingHorizontal: 15,
          }}>
          {counter}
        </Text>
        <TouchableOpacity
          onPress={() => {
            counter < 5 ? setCounter(pre => pre + 1) : null;
          }}
          style={{
            backgroundColor: 'white',
            width: 35,
            height: 35,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const fetchPaymentParams = async amount => {
  const response = await fetch(
    Platform.OS == 'ios'
      ? `http://localhost:4242/create-payment-intent`
      : `http://10.0.2.2:4242/create-payment-intent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({items: [{id: 'xl-tshirt'}], amount: amount}),
    },
  );
  const val = await response.json();
  return val;
};

const PaymentScreen = () => {
  const [price, setPrice] = useState(true);
  const [loading, setLoading] = useState(true);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const initializePaymentSheet = async amount => {
    setLoading(true);
    const {clientSecret, ephemeralKey, customer} = await fetchPaymentParams(
      amount,
    );
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
    console.log('error is', await error);
    if (!error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    initializePaymentSheet(price);
  }, [price]);
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };
  console.log(price);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      <></>
      <Counter
        setPrice={val => {
          setPrice(_ => val);
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          width: 100 + '%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 13,
          borderRadius: 8,
        }}
        onPress={openPaymentSheet}
        title="Pay Now"
        disabled={loading}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          {!loading ? `Pay Now ${price}$` : 'loading...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default PaymentScreen;