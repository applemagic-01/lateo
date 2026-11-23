import { Animated, StyleSheet, Text, View } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';
export type ChatMessage = { id: string; text: string; time: string; mine: boolean; status?: 'sent' | 'delivered' };
export function MessageBubble({ message }: { message: ChatMessage }) {
 const theme=useAnimatedTheme();
 return <View style={[styles.row,message.mine&&styles.mineRow]}><Animated.View style={[styles.bubble,message.mine?[styles.mine,{backgroundColor:theme.accentSoft}]:[styles.theirs,{backgroundColor:theme.surface,borderColor:theme.border}]]}><Animated.Text style={[styles.text,{color:message.mine?theme.accentText:theme.text}]}>{message.text}</Animated.Text><View style={styles.meta}><Animated.Text style={[styles.time,{color:message.mine?theme.accentText:theme.muted}]}>{message.time}</Animated.Text>{message.mine&&<Animated.Text style={[styles.status,{color:theme.accentText}]}>{message.status==='delivered'?'✓✓':'✓'}</Animated.Text>}</View></Animated.View></View>;
}
const styles=StyleSheet.create({row:{flexDirection:'row',justifyContent:'flex-start',marginVertical:5},mineRow:{justifyContent:'flex-end'},bubble:{maxWidth:'82%',paddingHorizontal:14,paddingVertical:10,borderRadius:18,borderWidth:1},mine:{borderBottomRightRadius:6,borderColor:'transparent'},theirs:{borderBottomLeftRadius:6},text:{fontSize:14,lineHeight:20},meta:{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',gap:5,marginTop:5},time:{fontSize:9},status:{fontSize:10,fontWeight:'600'}});
