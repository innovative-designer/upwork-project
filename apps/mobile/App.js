import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Platform.select({
    android: "http://10.0.2.2:4000",
    ios: "http://localhost:4000",
    default: "http://localhost:4000"
  });

function MessageCard({ item, onApprove, onReject }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
      <Text style={styles.preview}>{item.preview}</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>AI Summary</Text>
        <Text style={styles.summaryText}>{item.aiSummary}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onReject(item)}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.secondaryButtonText}>Reject</Text>
        </Pressable>
        <Pressable
          onPress={() => onApprove(item)}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.primaryButtonText}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

function HandledCard({ item }) {
  return (
    <View style={styles.handledCard}>
      <Text style={styles.handledSender}>{item.sender}</Text>
      <Text style={styles.handledSubject}>{item.subject}</Text>
      <Text style={styles.handledStatus}>Approved and moved to handled.</Text>
    </View>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [handledMessages, setHandledMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      try {
        const response = await fetch(`${API_URL}/messages`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load messages.");
        }

        if (active) {
          setMessages(data);
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, []);

  function handleApprove(item) {
    setMessages((current) => current.filter((message) => message.id !== item.id));
    setHandledMessages((current) => [item, ...current]);
  }

  function handleReject(item) {
    setMessages((current) => current.filter((message) => message.id !== item.id));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Task 2: Expo approve / reject flow</Text>
          <Text style={styles.title}>Inbox triage with AI summaries</Text>
          <Text style={styles.subtitle}>
            Messages are fetched from the Express API. Approve moves them to the
            handled section, while reject removes them from the active queue.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Messages</Text>
            <Text style={styles.sectionCount}>{messages.length}</Text>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#0f766e" />
              <Text style={styles.stateText}>Loading messages...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.helperText}>
                If you are testing on a physical device, set
                EXPO_PUBLIC_API_URL to your machine's LAN IP address.
              </Text>
            </View>
          ) : messages.length > 0 ? (
            messages.map((item) => (
              <MessageCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>All caught up</Text>
              <Text style={styles.helperText}>
                There are no pending messages left in the queue.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Handled</Text>
            <Text style={styles.sectionCount}>{handledMessages.length}</Text>
          </View>

          {handledMessages.length > 0 ? (
            handledMessages.map((item) => <HandledCard key={item.id} item={item} />)
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nothing handled yet</Text>
              <Text style={styles.helperText}>
                Approving a message moves it here for easy review.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6efe4"
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18
  },
  hero: {
    backgroundColor: "#fff9f0",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eadfce",
    shadowColor: "#2f1c11",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 4
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#6b7280",
    fontWeight: "700"
  },
  title: {
    marginTop: 12,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    color: "#1f2937"
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    color: "#52606d"
  },
  section: {
    gap: 12
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937"
  },
  sectionCount: {
    minWidth: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#dff5f2",
    textAlign: "center",
    fontWeight: "700",
    color: "#115e59"
  },
  card: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ebe2d4",
    gap: 12,
    shadowColor: "#1f2937",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 3
  },
  cardHeader: {
    gap: 4
  },
  sender: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  subject: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937"
  },
  preview: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569"
  },
  summaryBox: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#f4fbfa",
    borderWidth: 1,
    borderColor: "#d8efeb",
    gap: 6
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#0f766e"
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: "#111827",
    alignItems: "center"
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: "#fff3f0",
    borderWidth: 1,
    borderColor: "#ffd8cf",
    alignItems: "center"
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff7ed"
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#c2410c"
  },
  buttonPressed: {
    opacity: 0.85
  },
  handledCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#f4fbfa",
    borderWidth: 1,
    borderColor: "#d8efeb",
    gap: 4
  },
  handledSender: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  handledSubject: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937"
  },
  handledStatus: {
    fontSize: 13,
    color: "#52606d"
  },
  centerState: {
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: "#fff9f0",
    borderWidth: 1,
    borderColor: "#eadfce",
    alignItems: "center",
    gap: 12
  },
  stateText: {
    fontSize: 14,
    color: "#52606d"
  },
  errorBox: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    gap: 8
  },
  errorText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    color: "#be123c"
  },
  emptyBox: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#fff9f0",
    borderWidth: 1,
    borderColor: "#eadfce",
    gap: 8
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937"
  },
  helperText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#52606d"
  }
});
