import { Pressable, PressableProps, Text } from 'react-native';

interface CustomButtonProps extends PressableProps {
    children: string;
    color?: 'primary' | 'secondary' | 'tertiary';
    onPress: () => void;
    onLongPress?: () => void;
};

const CustomButton = ({ children, color, onPress, onLongPress, ...props }: CustomButtonProps) => {
    const btnColor = {
        primary: 'bg-green-500',
        secondary: 'bg-red-500',
        tertiary: 'bg-gray-500',
    }[color || 'tertiary'];

    // return (
    //     <TouchableOpacity onPress={onPress} className="bg-blue-500 p-3 rounded">
    //         <Text className="text-white text-center">{title}</Text>
    //     </TouchableOpacity>
    // );

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress} className={`mb-5 p-3 rounded-md ${btnColor} active:opacity-90`} {...props}>
            <Text className="text-white text-center">{children}</Text>
        </Pressable>
    );
};

export default CustomButton;