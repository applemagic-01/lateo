import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function MessageComposer({value,onChangeText,onSend}:{value:string;onChangeText:(text:string)=>void;onSend:()=>void}){
 const { palette: theme } = useTheme();const scale=useRef(new Animated.Value(1)).current;
 const press=(to:number)=>Animated.spring(scale,{toValue:to,useNativeDriver:true,speed:22,bounciness:4}).start();
 return <View style={styles.wrap}><Animated.View style={[styles.shell,{backgroundColor:theme.surface,borderColor:theme.border,shadowColor:theme.shadow}]}><TextInput value={value} onChangeText={onChangeText} placeholder="Write a message…" placeholderTextColor="#8B8795" multiline maxLength={4000} style={[styles.input,{color:theme.text}]} returnKeyType="send" onSubmitEditing={onSend}/><Animated.View style={{transform:[{scale}]}}><AnimatedPressable onPress={onSend} onPressIn={()=>press(.88)} onPressOut={()=>press(1)} accessibilityRole="button" accessibilityLabel="Send message" style={[styles.send,{backgroundColor:theme.accentSoft}]}> <Animated.Text style={[styles.sendIcon,{color:theme.accentText}]}>↑</Animated.Text></AnimatedPressable></Animated.View></Animated.View></View>;
}
const styles=StyleSheet.create({wrap:{paddingTop:10,paddingBottom:6},shell:{minHeight:52,borderRadius:22,borderWidth:1,flexDirection:'row',alignItems:'center',paddingLeft:16,paddingRight:6,shadowOffset:{width:2,height:3},shadowOpacity:.12,shadowRadius:6,elevation:2},input:{flex:1,maxHeight:100,fontSize:14,paddingVertical:10},send:{width:40,height:40,borderRadius:15,alignItems:'center',justifyContent:'center'},sendIcon:{fontSize:24,fontWeight:'600',marginTop:-2}});
