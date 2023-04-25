import * as React from 'react';
import {View, Text, Image} from 'react-native';
// import {StripeProvider} from '@stripe/stripe-react-native';
import {HyperProvider} from 'react-native-hyperswitch';
import CustomPaymentScreen from './CustomPaymentScreen';
import PaymentScreen from './PaymentScreen';
import {SvgUri} from 'react-native-svg';

const TextDetailView = ({text, uri}) => {
  return (
    <View
      style={{
        width: 100 + '%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
      }}>
      <SvgUri width="17" height="17" uri={uri} />
      <Text
        style={{
          paddingLeft: 5,
          color: 'white',
          fontWeight: 'bold',
          fontSize: 15,
        }}>
        {text}
      </Text>
    </View>
  );
};

function Home({navigation}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#080416',
        padding: 10,
      }}>
      {/* <StripeProvider
        publishableKey={
          'pk_test_51KP0OALGEyT9T908Fv0PuwhRMQ2N9sWsrwZQS5hvTan6m6e73Bsv42DyTQwiw63jlluM1tvzeemOrXlE1AvmKY3D00R0yeN1my'
        }
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="https://www.google.com/" // required for 3D Secure and bank redirects
      > */}
      <HyperProvider publishableKey={'3b33cd9404234113804aa1accaabe22f'}>
        <Image
          style={{
            width: 100 + '%',
            height: 50 + '%',
            borderRadius: 10,
            elevation: 4,
          }}
          source={{
            uri: 'https://static.get-in.com/gallery/tablet_cover_20230419_193027_251081.png',
          }}
        />
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 24,
            width: 100 + '%',
            paddingTop: 20,
          }}>
          NLE Choppa In Israel
        </Text>
        <TextDetailView
          text="Abarbanel St 88, Tel Aviv-Yafo, Israel"
          uri="https://get-in.com/en/assets/images/svg-icons/pointonmap.svg"
        />
        <TextDetailView
          text="May 3, 2023 20:00"
          uri="https://get-in.com/en/assets/images/svg-icons/calendar.svg"
        />
        <CustomPaymentScreen />
        {/* <PaymentScreen /> */}
        {/* </StripeProvider> */}
      </HyperProvider>
    </View>
  );
}
export default Home;
