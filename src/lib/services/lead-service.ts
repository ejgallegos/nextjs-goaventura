export interface LeadData {
  nombre: string;
  apellido: string;
  telefono: string;
  consulta: string;
  productId: string;
  productName: string;
  productType: string;
  pageUrl: string;
}

export interface LeadService {
  submit(data: LeadData): Promise<void>;
}

export class ConsoleLeadService implements LeadService {
  async submit(data: LeadData): Promise<void> {
    console.log('[LEAD] Nova solicitud de asesor:', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}

export class WebhookLeadService implements LeadService {
  constructor(private webhookUrl: string) {}

  async submit(data: LeadData): Promise<void> {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }
  }
}
