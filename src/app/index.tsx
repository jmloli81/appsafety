import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="./home" />;
    // return (
    // <SafeAreaView>
    //   <View className="mt-6 mx-2.5">
    //     <Text className="text-6xl" style={{ fontFamily: 'WorkSans-Black' }}> Hola mundo </Text>
    //     <Text className="text-5xl font-work-black text-primary"> Hola mundo </Text>
    //     <Text className="text-4xl font-work-medium text-secondary"> Hola mundo </Text>
    //     <Text className="text-3xl font-work-light"> Hola mundo </Text>
    //     <Text className="text-xl text-tertiary-light"> Hola mundo </Text>
    //     <Link href="./cards">
    //       <Text>Go to Cards</Text>
    //     </Link>
    //   </View>
    // </SafeAreaView>
  //);
};
export default index
