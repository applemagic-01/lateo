import { router } from 'expo-router';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAnimatedTheme } from '../../theme/ThemeProvider';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function ConversationHeader({name,initials,color}:{name:string;initials:string;color:string}){
 const theme=useAnimatedTheme();
 return <View style={styles.header}><AnimatedPressable onPress={()=>router.back()} style={[styles.back,{backgroundColor:theme.surface,borderColor:theme.border}]}<Animated.Text style={[styles.backText,{color:theme.text}]}>‹</Animated.Text></AnimatedPressable><View style={[styles.avatar,{backgroundColor:color}]}><Animated.Text style={styles.initials}>{initials}</Animated.Text></View><View style={styles.info}><Animated.Text style={[styles.name,{color:theme.text}]}>{name}</Animated.Text><Animated.Text style={[styles.status,{color:theme.muted}]}>Anonymous connection</Animated.Text></View><ThemeToggle/></View>;
}
const styles=StyleSheet.create({header:{flexDirection:'row',alignItems:'center',gap:10,paddingBottom:14},back:{width:38,height:38,borderRadius:13,borderWidth:1,alignItems:'center',justifyContent:'center'},backText:{fontSize:27,marginTop:-3},avatar:{width:38,height:38,borderRadius:14,alignItems:'center',justifyContent:'center'},initials:{color:'#FFFFFF',fontSize:14,fontWeight:'600'},info:{flex:1,gap:3},name:{fontSize:14,fontWeight:'600'},status:{fontSize:10}});
