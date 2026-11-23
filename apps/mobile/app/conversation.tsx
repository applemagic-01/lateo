import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { ConversationHeader } from '../src/components/messaging/ConversationHeader';
import { MessageBubble, ChatMessage } from '../src/components/messaging/MessageBubble';
import { MessageComposer } from '../src/components/messaging/MessageComposer';
import { useAnimatedTheme } from '../src/theme/ThemeProvider';
const initial:ChatMessage[]=[{id:'1',text:'Hey, good to hear from you.',time:'9:41',mine:false},{id:'2',text:'I was hoping we could talk.',time:'9:42',mine:true,status:'delivered'},{id:'3',text:'Of course. What’s on your mind?',time:'9:42',mine:false},{id:'4',text:'Just wanted to check in. No pressure.',time:'9:43',mine:true,status:'sent'}];
export default function ConversationScreen(){
 const params=useLocalSearchParams<{name?:string;initials?:string;color?:string}>();const name=params.name||'New connection';const initials=params.initials||'L';const color=params.color||'#7766B5';
 const [messages,setMessages]=useState(initial);const [draft,setDraft]=useState('');const theme=useAnimatedTheme();
 const send=()=>{const text=draft.trim();if(!text)return;setMessages(prev=>[...prev,{id:Date.now().toString(),text,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),mine:true,status:'sent'}]);setDraft('');};
 return <Screen padded={false} contentStyle={styles.screen}><KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS==='ios'?'padding':'height'}><View style={styles.top}><ConversationHeader name={name} initials={initials} color={color}/></View><View style={styles.disclaimer}><NeumorphicSurface style={styles.notice}><Animated.Text style={[styles.noticeText,{color:theme.muted}]}>Prototype conversation · Messages are stored locally in memory and are not encrypted.</Animated.Text></NeumorphicSurface></View><FlatList data={messages} keyExtractor={item=>item.id} renderItem={({item})=><MessageBubble message={item}/>} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/><View style={styles.composer}><MessageComposer value={draft} onChangeText={setDraft} onSend={send}/></View></KeyboardAvoidingView></Screen>;
}
const styles=StyleSheet.create({screen:{paddingHorizontal:16,paddingTop:12,paddingBottom:6},keyboard:{flex:1},top:{paddingHorizontal:4},disclaimer:{paddingHorizontal:4,paddingBottom:8},notice:{paddingVertical:9,paddingHorizontal:12,borderRadius:14},noticeText:{fontSize:10,textAlign:'center',lineHeight:15},list:{paddingVertical:12,flexGrow:1},composer:{paddingHorizontal:4}});
