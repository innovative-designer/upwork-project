export const resources = {
  en: {
    translation: {
      common: {
        productTag: "Upwork sample build",
        liveBadge: "Live updates every 10 seconds",
        language: "Language",
        languageHint: "Pick the interface you want to preview.",
        savedPreference: "Saved locally",
        rtlReady: "RTL ready",
        viewMenu: "Workspace menu",
        controlCenter: "Control center",
        controlCenterDescription:
          "Jump between the dashboard and billing flow, then preview the interface in another language.",
        languages: {
          en: "English",
          ar: "Arabic",
          es: "Spanish"
        }
      },
      navigation: {
        dashboard: "Dashboard",
        billing: "Billing"
      },
      dashboard: {
        eyebrow: "Task 1 and Task 4",
        title:
          "A live operations dashboard with polling, persistence, and RTL-ready language switching.",
        description:
          "This page polls a custom API every 10 seconds, keeps the UI live without refreshes, and flips cleanly into Arabic when you switch languages.",
        loading: "Refreshing live metrics...",
        waiting: "Waiting for data",
        cards: {
          requests: "Requests made",
          tokens: "Tokens used",
          connections: "Active connections",
          sessions: "Completed sessions"
        },
        cardHelp: {
          requests: "Simulated request volume grows with each polling cycle.",
          tokens: "Token usage rises alongside the request stream.",
          connections: "Concurrent connections fluctuate to mimic real traffic.",
          sessions: "Finished billing sessions are counted from PostgreSQL."
        },
        sidePanel: {
          title: "Demo notes",
          heading: "What this view proves",
          badge: "Healthy",
          polling:
            "The cards above are driven by an Express endpoint and refresh in place every 10 seconds.",
          networking:
            "In Docker, the Next.js service talks to the API through an internal network route handler proxy.",
          persistence:
            "Language preference is saved locally and Arabic switches the page into a true RTL layout."
        },
        status: {
          lastUpdated: "Last updated",
          health: "Status",
          healthy: "Connected to the demo backend"
        }
      },
      billing: {
        eyebrow: "Task 5",
        title:
          "Session-based billing with a live cost counter and Stripe test-mode intent creation.",
        description:
          "Start a session, watch the timer and running total update every second, then end it to create a Stripe PaymentIntent and display the returned ID.",
        sessionLabel: "Session state",
        states: {
          idle: "Ready to start",
          running: "Session is running",
          submitting: "Creating payment intent",
          completed: "Session complete"
        },
        rate: "$0.02 per second",
        elapsed: "Elapsed time",
        runningCost: "Running cost",
        start: "Start Session",
        end: "End Session",
        processing: "Ending session...",
        hint:
          "Stripe test mode enforces a minimum charge for USD card payments, so sessions shorter than 25 seconds will show a small minimum-charge note.",
        summary: "Stripe result",
        summaryHeading: "Billing snapshot",
        finalCost: "Final session cost",
        chargedAmount: "Amount sent to Stripe",
        paymentIntentId: "PaymentIntent ID",
        minimumApplied:
          "Stripe's minimum test charge was applied, but the actual calculated session total is still shown above.",
        emptyState:
          "Finish a session to show the final cost and the PaymentIntent ID returned by the backend."
      }
    }
  },
  ar: {
    translation: {
      common: {
        productTag: "نسخة تجريبية لاختبار Upwork",
        liveBadge: "تحديث مباشر كل 10 ثوان",
        language: "اللغة",
        languageHint: "اختر الواجهة التي تريد معاينتها.",
        savedPreference: "محفوظ محلياً",
        rtlReady: "جاهز لـ RTL",
        viewMenu: "قائمة الواجهة",
        controlCenter: "مركز التحكم",
        controlCenterDescription:
          "انتقل بين لوحة التحكم وصفحة الفوترة، ثم عاين الواجهة بلغة أخرى بسهولة.",
        languages: {
          en: "الإنجليزية",
          ar: "العربية",
          es: "الإسبانية"
        }
      },
      navigation: {
        dashboard: "لوحة التحكم",
        billing: "الفوترة"
      },
      dashboard: {
        eyebrow: "المهمة 1 والمهمة 4",
        title: "لوحة تشغيل مباشرة مع تحديثات دورية ودعم كامل للغات واتجاه RTL.",
        description:
          "تقوم هذه الصفحة بطلب البيانات من واجهة API مخصصة كل 10 ثوان، وتحدث الواجهة مباشرة بدون إعادة تحميل، وتتحول بشكل صحيح إلى العربية من اليمين إلى اليسار.",
        loading: "جار تحديث المؤشرات المباشرة...",
        waiting: "بانتظار البيانات",
        cards: {
          requests: "عدد الطلبات",
          tokens: "عدد التوكنز",
          connections: "الاتصالات النشطة",
          sessions: "الجلسات المكتملة"
        },
        cardHelp: {
          requests: "يزداد حجم الطلبات التجريبي مع كل دورة تحديث.",
          tokens: "يرتفع استهلاك التوكنز مع تدفق الطلبات.",
          connections: "يتغير عدد الاتصالات لمحاكاة حركة استخدام حقيقية.",
          sessions: "يتم احتساب الجلسات المنتهية من قاعدة PostgreSQL."
        },
        sidePanel: {
          title: "ملاحظات العرض",
          heading: "ما الذي تثبته هذه الصفحة",
          badge: "سليم",
          polling:
            "البطاقات أعلاه تعتمد على نقطة Express وتُحدث نفسها كل 10 ثوان داخل الصفحة.",
          networking:
            "داخل Docker، تتصل خدمة Next.js بواجهة API من خلال proxy داخلي داخل الشبكة.",
          persistence:
            "تفضيل اللغة يُحفظ محلياً، وعند اختيار العربية تنقلب الصفحة بالكامل إلى اتجاه RTL."
        },
        status: {
          lastUpdated: "آخر تحديث",
          health: "الحالة",
          healthy: "متصل بالخادم التجريبي"
        }
      },
      billing: {
        eyebrow: "المهمة 5",
        title:
          "فوترة حسب الجلسة مع عداد تكلفة مباشر وإنشاء PaymentIntent في وضع الاختبار.",
        description:
          "ابدأ الجلسة، راقب المؤقت والتكلفة التي تتحدث كل ثانية، ثم أنهها لإنشاء PaymentIntent من Stripe وعرض المعرّف الناتج.",
        sessionLabel: "حالة الجلسة",
        states: {
          idle: "جاهزة للبدء",
          running: "الجلسة قيد التشغيل",
          submitting: "جار إنشاء PaymentIntent",
          completed: "اكتملت الجلسة"
        },
        rate: "0.02 دولار لكل ثانية",
        elapsed: "الوقت المنقضي",
        runningCost: "التكلفة الحالية",
        start: "بدء الجلسة",
        end: "إنهاء الجلسة",
        processing: "جار إنهاء الجلسة...",
        hint:
          "يفرض Stripe في وضع الاختبار حداً أدنى لبعض عمليات الدفع بالدولار، لذلك قد تظهر ملاحظة صغيرة إذا كانت الجلسة أقصر من 25 ثانية.",
        summary: "نتيجة Stripe",
        summaryHeading: "ملخص الفوترة",
        finalCost: "التكلفة النهائية للجلسة",
        chargedAmount: "المبلغ المرسل إلى Stripe",
        paymentIntentId: "معرّف PaymentIntent",
        minimumApplied:
          "تم تطبيق الحد الأدنى المطلوب من Stripe، لكن التكلفة الفعلية المحسوبة للجلسة ما زالت معروضة أعلاه.",
        emptyState:
          "قم بإنهاء الجلسة لإظهار التكلفة النهائية ومعرّف PaymentIntent الذي أعاده الخادم."
      }
    }
  },
  es: {
    translation: {
      common: {
        productTag: "Demo para Upwork",
        liveBadge: "Actualiza cada 10 segundos",
        language: "Idioma",
        languageHint: "Elige la interfaz que quieres revisar.",
        savedPreference: "Guardado localmente",
        rtlReady: "Listo para RTL",
        viewMenu: "Menu de trabajo",
        controlCenter: "Centro de control",
        controlCenterDescription:
          "Cambia entre el panel y el flujo de cobro, y luego revisa la interfaz en otro idioma.",
        languages: {
          en: "Ingles",
          ar: "Arabe",
          es: "Espanol"
        }
      },
      navigation: {
        dashboard: "Panel",
        billing: "Cobro"
      },
      dashboard: {
        eyebrow: "Tarea 1 y Tarea 4",
        title: "Un panel operativo en vivo con sondeo, persistencia y cambio limpio a RTL.",
        description:
          "Esta pagina consulta una API personalizada cada 10 segundos, actualiza la interfaz sin recargar y cambia correctamente al modo arabe RTL.",
        loading: "Actualizando metricas en vivo...",
        waiting: "Esperando datos",
        cards: {
          requests: "Solicitudes realizadas",
          tokens: "Tokens usados",
          connections: "Conexiones activas",
          sessions: "Sesiones completadas"
        },
        cardHelp: {
          requests: "El volumen simulado crece en cada ciclo de sondeo.",
          tokens: "El consumo de tokens sube junto con el trafico.",
          connections: "Las conexiones concurrentes cambian para imitar trafico real.",
          sessions: "Las sesiones terminadas se cuentan desde PostgreSQL."
        },
        sidePanel: {
          title: "Notas del demo",
          heading: "Lo que demuestra esta vista",
          badge: "Saludable",
          polling:
            "Las tarjetas se alimentan desde Express y se actualizan cada 10 segundos sin refrescar la pagina.",
          networking:
            "Dentro de Docker, Next.js se comunica con la API usando un proxy interno entre servicios.",
          persistence:
            "La preferencia de idioma se guarda localmente y el arabe cambia toda la interfaz a RTL."
        },
        status: {
          lastUpdated: "Ultima actualizacion",
          health: "Estado",
          healthy: "Conectado al backend de prueba"
        }
      },
      billing: {
        eyebrow: "Tarea 5",
        title:
          "Cobro por sesion con contador en vivo y creacion de PaymentIntent en Stripe.",
        description:
          "Inicia una sesion, mira el temporizador y el costo actualizarse cada segundo, y al terminar crea un PaymentIntent en modo de prueba y muestra su ID.",
        sessionLabel: "Estado de la sesion",
        states: {
          idle: "Lista para iniciar",
          running: "Sesion en curso",
          submitting: "Creando PaymentIntent",
          completed: "Sesion completada"
        },
        rate: "$0.02 por segundo",
        elapsed: "Tiempo transcurrido",
        runningCost: "Costo acumulado",
        start: "Iniciar sesion",
        end: "Terminar sesion",
        processing: "Terminando sesion...",
        hint:
          "Stripe en modo de prueba aplica un minimo para pagos en USD, por eso las sesiones de menos de 25 segundos pueden mostrar una nota de cargo minimo.",
        summary: "Resultado de Stripe",
        summaryHeading: "Resumen de cobro",
        finalCost: "Costo final de la sesion",
        chargedAmount: "Monto enviado a Stripe",
        paymentIntentId: "ID de PaymentIntent",
        minimumApplied:
          "Se aplico el minimo requerido por Stripe, pero el total real calculado sigue mostrandose arriba.",
        emptyState:
          "Termina una sesion para mostrar el costo final y el ID de PaymentIntent devuelto por el backend."
      }
    }
  }
};
