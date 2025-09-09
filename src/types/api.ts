export interface FormRequest {
  RutUsuario: string;
  PasswordSII: string;
  RutEmpresa: string;
  Ambiente: number;
}

export interface OtroImpuesto {
  valor: string;
  tasa: string;
  codigo: number;
}

export interface DetalleCompra {
  tipoDTEString: string;
  tipoDTE: number;
  tipoCompra: string;
  rutProveedor: string;
  razonSocial: string;
  folio: number;
  fechaEmision: string;
  fechaRecepcion: string;
  acuseRecibo: string | null;
  montoExento: number;
  montoNeto: number;
  montoIvaRecuperable: number;
  montoIvaNoRecuperable: number;
  codigoIvaNoRecuperable: number;
  montoTotal: number;
  montoNetoActivoFijo: number;
  ivaActivoFijo: number;
  ivaUsoComun: number;
  impuestoSinDerechoCredito: number;
  ivaNoRetenido: number;
  tabacosPuros: number | null;
  tabacosCigarrillos: number | null;
  tabacosElaborados: number | null;
  nceNdeFacturaCompra: number;
  valorOtroImpuesto: string;
  tasaOtroImpuesto: string;
  codigoOtroImpuesto: number;
  estado: string;
  fechaAcuse: string | null;
  otrosImpuestos?: OtroImpuesto[];
}

export interface ResumenCompra {
  tipoDte: number;
  tipoDteString: string;
  totalDocumentos: number;
  montoExento: number;
  montoNeto: number;
  ivaRecuperable: number;
  ivaUsoComun: number;
  ivaNoRecuperable: number;
  montoTotal: number;
  estado: string;
}

export interface Caratula {
  rutEmpresa: string;
  nombreMes: string;
  mes: number;
  anio: number;
  dia: number | null;
  periodo: string;
}

export interface Compras {
  resumenes: ResumenCompra[];
  detalleCompras: DetalleCompra[];
}

export interface Ventas {
  resumenes: any[];
  detalleVentas: any[];
}

export interface FormResponse {
  caratula: Caratula;
  compras: Compras;
  ventas: Ventas;
}
