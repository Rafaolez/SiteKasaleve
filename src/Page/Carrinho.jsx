import "../css/carrinho.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';

// ─── DADOS DE CORES ──────────────────────────────────────────────────────────
const PINTURA = [
  { id: 'p1', nome: 'Fendi', hex: '#8a7a58', cat: 'pintura' },
  { id: 'p5', nome: 'Off White', hex: '#e8e4d8', cat: 'pintura' },
  { id: 'p7', nome: 'Preto', hex: '#1a1a1a', cat: 'pintura' },
];
const CORDAS = [
  { id: 'c1', nome: 'Verde Musgo', codigo: '#70292', hex: '#4a5e3a', cat: 'corda' },
  { id: 'c7', nome: 'Preto', codigo: '#70268', hex: '#1a1a1a', cat: 'corda' },
  { id: 'c3', nome: 'Mescla Areia', codigo: '#84202', hex: '#c8b89a', cat: 'corda' },
];
const TECIDOS = [
  { id: 't1', nome: 'Linho Natural', fabricante: 'Karsten', hex: '#c4b89a', cat: 'tecido' },
  { id: 't6', nome: 'Azul Naval', fabricante: 'Karsten', hex: '#1e2f5a', cat: 'tecido' },
];

const produtos = [
   // ─── SOFÁS ────────────────────────────────────────────────────────────────────

  { id: 1,  nome: 'Sófa Gold',     descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.SofaGolg_Id01.webp', status: 'Sofá',    variacoes: [{ medida: '140x73 cm', preco: 9298.05 }] },
  { id: 5,  nome: 'Sófa Artístico',descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id05.webp',           status: 'Sofá',    variacoes: [{ preco: 8824.20 }] },
  { id: 9,  nome: 'Sófa Ilustre',  descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id09.webp',           status: 'Sofá',    variacoes: [{ preco: 8319.35 }] },
  { id: 15, nome: 'Sófa Essência', descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id15.webp',           status: 'Sofá',    variacoes: [{ preco: 8786.90 }] },
  { id: 17, nome: 'Sófa Serena',   descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id17.webp',           status: 'Sofá',    variacoes: [{ preco: 7354.65 }] },
  { id: 22, nome: 'Sófa Astúcia',  descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id22.webp',           status: 'Sofá',    variacoes: [{ preco: 7675.20 }] },
  { id: 28, nome: 'Sófa Comfort',  descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id28.webp',           status: 'Sofá',    variacoes: [{ preco: 6783.25 }] },
  { id: 13, nome: 'Sófa Prisma',   descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id13.webp',           status: 'Sofá',    variacoes: [{ preco: 5926.10 }] },
  { id: 19, nome: 'Sófa Trivial',  descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id19.webp',           status: 'Sofá',    variacoes: [{ preco: 4430.90 }] },
  { id: 26, nome: 'Sófa Harmonia', descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id26.webp',           status: 'Sofá',    variacoes: [{ preco: 4698.00 }] },
  { id: 30, nome: 'Sófa Soft',     descricao: 'Sofá em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id30.webp',           status: 'Sofá',    variacoes: [{ preco: 6010.55 }] },

  // ─── SOFÁ SOFT MODULAR ────────────────────────────────────────────────────────

  {
    id: 33,
    nome: 'Soft Modular',
    descricao: 'Linha modular Soft.',
    img: '/Imagens/Produtos/Img.Id33.webp',
    status: 'Modular',
    variacoes: [
      { medida: 'Sofá 3 lugares',        preco: 5570.55, img: '/Imagens/Produtos/Img.Id34Modulo.webp' },
      { medida: 'Sofá 2 lugares',        preco: 4187.40, img: '/Imagens/Produtos/Img.Id35Modulo.webp' },
      { medida: 'Poltrona',              preco: 2916.75, img: '/Imagens/Produtos/Img.Id36Modulo.webp' },
      { medida: 'Poltrona Mesa Esquerda',preco: 4249.00, img: '/Imagens/Produtos/Img.Id37Modulo.webp' },
      { medida: 'Poltrona Mesa Direita', preco: 4249.00, img: '/Imagens/Produtos/Img.Id38Modulo.webp' },
      { medida: 'Chaise Esquerda',       preco: 5048.75, img: '/Imagens/Produtos/Img.Id39Modulo.webp' },
      { medida: 'Chaise Direita',        preco: 5048.75, img: '/Imagens/Produtos/Img.Id40Modulo.webp' },
    ],
  },

  // ─── POLTRONAS ────────────────────────────────────────────────────────────────

  { id: 2,  nome: 'Poltrona Gold',         descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.PoltronaGold_Id02.webp', status: 'Poltrona', variacoes: [{ medida: '84x73 cm', preco: 5296.40 }] },
  { id: 6,  nome: 'Poltrona Artístico',    descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id06.webp',              status: 'Poltrona', variacoes: [{ preco: 4418.95 }] },
  { id: 10, nome: 'Poltrona Ilustre',      descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id10.webp',              status: 'Poltrona', variacoes: [{ preco: 3795.55 }] },
  { id: 16, nome: 'Poltrona Essência',     descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id16.webp',              status: 'Poltrona', variacoes: [{ preco: 3939.75 }] },
  { id: 18, nome: 'Poltrona Serena',       descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id18.webp',              status: 'Poltrona', variacoes: [{ preco: 3338.25 }] },
  { id: 23, nome: 'Poltrona Astúcia',      descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id23.webp',              status: 'Poltrona', variacoes: [{ preco: 3707.95 }] },
  { id: 29, nome: 'Poltrona Comfort',      descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id29.webp',              status: 'Poltrona', variacoes: [{ preco: 3573.20 }] },
  { id: 14, nome: 'Poltrona Prisma',       descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id14.webp',              status: 'Poltrona', variacoes: [{ preco: 3019.10 }] },
  { id: 20, nome: 'Poltrona Trivial',      descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id20.webp',              status: 'Poltrona', variacoes: [{ preco: 2566.55 }] },
  { id: 27, nome: 'Poltrona Harmonia',     descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id27.webp',              status: 'Poltrona', variacoes: [{ preco: 2310.25 }] },
  { id: 31, nome: 'Poltrona Soft',         descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id31.webp',              status: 'Poltrona', variacoes: [{ preco: 3307.80 }] },
  { id: 41, nome: 'Poltrona Gold Plus',    descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id41.webp',              status: 'Poltrona', variacoes: [{ preco: 3483.75 }] },
  { id: 40, nome: 'Poltrona Comfort Plus', descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id40.webp',              status: 'Poltrona', variacoes: [{ preco: 2198.80 }] },
  { id: 42, nome: 'Poltrona Encanto',      descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Imag.IdEncanto.png',         status: 'Poltrona', variacoes: [{ preco: 1614.60 }] },
  { id: 43, nome: 'Poltrona Elegance',     descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id43.webp',              status: 'Poltrona', variacoes: [{ preco: 1860.95 }] },
  { id: 44, nome: 'Poltrona Aconchego',    descricao: 'Poltrona em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id44.webp',              status: 'Poltrona', variacoes: [{ preco: 1725.30 }] },

  // ─── CHAISES ──────────────────────────────────────────────────────────────────

  { id: 36, nome: 'Chaise Gold',    descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id36.webp',           status: 'Chaise', variacoes: [{ preco: 11218.80 }] },
  { id: 34, nome: 'Chaise Comfort', descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id34.webp',           status: 'Chaise', variacoes: [{ preco: 7752.60 }] },
  { id: 35, nome: 'Chaise Prisma',  descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id35.webp',           status: 'Chaise', variacoes: [{ preco: 6427.90 }] },
  { id: 21, nome: 'Chaise Trivial', descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id21.webp',           status: 'Chaise', variacoes: [{ preco: 6579.45 }] },
  { id: 37, nome: 'Chaise Encanto', descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id37.png',            status: 'Chaise', variacoes: [{ medida: '1,00m', preco: 5966.15 }, { medida: '1,20m', preco: 7279.40 }, { medida: '1,50m', preco: 9123.10 }, { medida: '1,80m', preco: 10938.05 }] },
  { id: 38, nome: 'Chaise Júbilo',  descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/JUBILO(1).jpg',           status: 'Chaise', variacoes: [{ medida: '1,00m', preco: 4797.30 }, { medida: '1,20m', preco: 6032.65 }, { medida: '1,50m', preco: 8265.95 }, { medida: '1,80m', preco: 10548.45 }] },
  { id: 39, nome: 'Chaise Vivência',descricao: 'Chaise em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id39.webp',           status: 'Chaise', variacoes: [{ medida: '1,00m', preco: 4018.10 }, { medida: '1,20m', preco: 5331.35 }, { medida: '1,50m', preco: 7097.15 }, { medida: '1,80m', preco: 8756.25 }] },

  // ─── ACONCHEGO ────────────────────────────────────────────────────────────────

  { id: 45, nome: 'Puff Aconchego',    descricao: 'Puff em alumínio 100% e corda náutica.',       img: '/Imagens/Produtos/Img.Id45.jpg',   status: 'Puff',           variacoes: [{ preco: 1204.70 }] },
  { id: 46, nome: 'Balanço Aconchego', descricao: 'Balanço em alumínio 100% e corda náutica.',    img: '/Imagens/Produtos/Img.Id46.webp',  status: 'Balanço',        variacoes: [{ preco: 3795.75 }] },
  { id: 48, nome: 'Suporte Aconchego', descricao: 'Suporte para balanço.',                        img: '/Imagens/Produtos/Img.Id48.webp',  status: 'Acessório',      variacoes: [{ preco: 2264.40 }] },
  { id: 47, nome: 'Espreguiçadeira Aconchego', descricao: 'Espreguiçadeira em alumínio 100% e corda náutica.', img: '/Imagens/Produtos/Img.Id47.webp', status: 'Espreguiçadeira', variacoes: [{ medida: 'Padrão', preco: 3017.65 }, { medida: 'Com Cobertura', preco: 3912.75 }] },

  // ─── ESPREGUIÇADEIRAS ─────────────────────────────────────────────────────────

  { id: 49, nome: 'Espreguiçadeira Itália',    descricao: 'Espreguiçadeira em alumínio.', img: '/Imagens/Produtos/Img.Id49.webp',  status: 'Espreguiçadeira', variacoes: [{ preco: 2153.55 }] },
  { id: 50, nome: 'Espreguiçadeira Star',      descricao: 'Espreguiçadeira em alumínio.', img: '/Imagens/Produtos/Img.Id50.webp',  status: 'Espreguiçadeira', variacoes: [{ preco: 2583.65 }] },
  { id: 52, nome: 'Espreguiçadeira Star Fibra',descricao: 'Espreguiçadeira em fibra.',    img: '/Imagens/Produtos/Img.Id52.webp',  status: 'Espreguiçadeira', variacoes: [{ preco: 1982.70 }] },

  // ─── CADEIRAS ─────────────────────────────────────────────────────────────────

  { id: 51, nome: 'Cadeira Star Fibra',           descricao: 'Cadeira em fibra.',    img: '',  status: 'Cadeira', variacoes: [{ medida: 'Sem Braço', preco: 726.85 }, { medida: 'Com Braço', preco: 868.05 }] },
  { id: 54, nome: 'Cadeira Comfort',              descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1117.55 }] },
  { id: 55, nome: 'Cadeira Duda',                 descricao: 'Cadeira em alumínio e corda náutica.', img: '', status: 'Cadeira', variacoes: [{ preco: 1027.10 }] },
  { id: 56, nome: 'Cadeira Elegance',             descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 940.00 }] },
  { id: 57, nome: 'Cadeira Essência',             descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1117.55 }] },
  { id: 58, nome: 'Cadeira France',               descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1096.35 }] },
  { id: 59, nome: 'Cadeira Gold',                 descricao: 'Cadeira em alumínio e corda náutica.', img: '', status: 'Cadeira', variacoes: [{ preco: 1364.55 }] },
  { id: 60, nome: 'Cadeira Luma',                 descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1050.00 }] },
  { id: 61, nome: 'Cadeira Vitta',                descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1194.00 }] },
  { id: 62, nome: 'Cadeira Lira',                 descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 970.00 }] },
  { id: 63, nome: 'Cadeira Maya',                 descricao: 'Cadeira em alumínio e corda náutica.', img: '', status: 'Cadeira', variacoes: [{ preco: 1331.00 }] },
  { id: 64, nome: 'Cadeira Itália',               descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 900.80 }] },
  { id: 65, nome: 'Cadeira Premium',              descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ medida: 'Sem Braço', preco: 970.05 }, { medida: 'Com Braço', preco: 1265.10 }] },
  { id: 66, nome: 'Cadeira Sol',                  descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ preco: 1087.50 }] },
  { id: 67, nome: 'Cadeira Star Leve',            descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ medida: 'Sem Braço', preco: 1078.50 }, { medida: 'Com Braço', preco: 1204.80 }] },
  { id: 68, nome: 'Cadeira Industrial',           descricao: 'Cadeira em alumínio.', img: '',  status: 'Cadeira', variacoes: [{ medida: 'Sem Braço', preco: 759.90 }, { medida: 'Com Braço', preco: 906.55 }] },

  // ─── BANQUETAS ────────────────────────────────────────────────────────────────

  { id: 53, nome: 'Banqueta Star Fibra',   descricao: 'Banqueta em fibra.',    img: '',  status: 'Banqueta', variacoes: [{ medida: 'Sem Braço', preco: 753.60 }, { medida: 'Com Braço', preco: 1063.60 }] },
  { id: 69, nome: 'Banqueta Comfort',      descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1234.90 }] },
  { id: 70, nome: 'Banqueta Elegance',     descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1057.30 }] },
  { id: 71, nome: 'Banqueta Gold',         descricao: 'Banqueta em alumínio e corda náutica.', img: '', status: 'Banqueta', variacoes: [{ preco: 1490.75 }] },
  { id: 72, nome: 'Banqueta Itália',       descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1048.30 }] },
  { id: 73, nome: 'Banqueta Premium',      descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1057.30 }] },
  { id: 74, nome: 'Banqueta Star Leve',    descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1400.30 }] },
  { id: 75, nome: 'Banqueta Luma',         descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1198.00 }] },
  { id: 76, nome: 'Banqueta Vitta',        descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 1257.00 }] },
  { id: 77, nome: 'Banqueta Trivial',      descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ medida: 'Baixa', preco: 632.70 }, { medida: 'Alta', preco: 741.15 }] },
  { id: 78, nome: 'Banqueta Industrial',   descricao: 'Banqueta em alumínio.', img: '',  status: 'Banqueta', variacoes: [{ preco: 869.90 }] },

  // ─── MESAS DE JANTAR – TAMPO MADEIRA ─────────────────────────────────────────

  {
    id: 79,
    nome: 'Mesa Premium',
    descricao: 'Mesa de jantar linha Premium. Tampo madeira. Largura 90 cm.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '90x160x75', preco: 4009.10 },
      { medida: '90x180x75', preco: 4094.35 },
      { medida: '90x200x75', preco: 4476.00 },
      { medida: '90x240x75', preco: 4697.10 },
      { medida: '90x260x75', preco: 5034.75 },
      { medida: '90x280x75', preco: 5130.45 },
    ],
  },
  {
    id: 80,
    nome: 'Mesa Sol',
    descricao: 'Mesa de jantar redonda linha Sol. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 2745.40 },
      { medida: '120x75', preco: 3488.75 },
      { medida: '150x75', preco: 4807.45 },
      { medida: '180x75', preco: 7159.85 },
    ],
  },
  {
    id: 81,
    nome: 'Mesa Star Leve',
    descricao: 'Mesa de jantar redonda linha Star Leve. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 2746.05 },
      { medida: '120x75', preco: 3488.75 },
      { medida: '150x75', preco: 4807.45 },
      { medida: '180x75', preco: 7159.85 },
    ],
  },
  {
    id: 82,
    nome: 'Mesa Taça',
    descricao: 'Mesa de jantar redonda linha Taça. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 3047.30 },
      { medida: '120x75', preco: 3500.20 },
      { medida: '150x75', preco: 5910.75 },
      { medida: '180x75', preco: 7125.09 },
    ],
  },
  {
    id: 83,
    nome: 'Mesa Gold',
    descricao: 'Mesa de jantar linha Gold. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '150x75', preco: 4348.45 },
      { medida: '180x75', preco: 6502.05 },
    ],
  },
  {
    id: 84,
    nome: 'Mesa Comfort',
    descricao: 'Mesa de jantar linha Comfort. Tampo madeira. Largura 90 cm.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '90x160x75', preco: 3481.40 },
      { medida: '90x180x75', preco: 3566.65 },
      { medida: '90x200x75', preco: 3948.30 },
      { medida: '90x240x75', preco: 4169.40 },
      { medida: '90x260x75', preco: 4507.05 },
      { medida: '90x280x75', preco: 4602.75 },
    ],
  },
  {
    id: 85,
    nome: 'Mesa Ilustre',
    descricao: 'Mesa de jantar linha Ilustre. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '80x80x75',   preco: 2084.25 },
      { medida: '100x100x75', preco: 2360.00 },
    ],
  },
  {
    id: 86,
    nome: 'Mesa Industrial',
    descricao: 'Mesa de jantar linha Industrial. Tampo madeira.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 2136.55 },
      { medida: '120x75', preco: 2624.05 },
      { medida: '150x75', preco: 4351.10 },
      { medida: '180x75', preco: 6462.90 },
    ],
  },
  {
    id: 87,
    nome: 'Mesa Star',
    descricao: 'Mesa de jantar linha Star. Tampo madeira. Largura 90 cm.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '90x160x75', preco: 2601.40 },
      { medida: '90x180x75', preco: 2686.65 },
      { medida: '90x200x75', preco: 3068.30 },
      { medida: '90x240x75', preco: 3289.40 },
      { medida: '90x260x75', preco: 3627.05 },
      { medida: '90x280x75', preco: 3722.75 },
    ],
  },

  // ─── MESAS DE JANTAR – ALUMÍNIO TOTAL ────────────────────────────────────────

  {
    id: 88,
    nome: 'Mesa Italia II',
    descricao: 'Mesa de jantar linha Italia II. Alumínio total.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 1933.10 },
      { medida: '120x75', preco: 2483.10 },
      { medida: '150x75', preco: 3496.50 },
      { medida: '180x75', preco: 3996.00 },
    ],
  },
  {
    id: 89,
    nome: 'Mesa France',
    descricao: 'Mesa redonda linha France. Alumínio total. 60x75 cm.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [{ preco: 1236.55 }],
  },
  {
    id: 90,
    nome: 'Mesa Ilustre (alumínio)',
    descricao: 'Mesa de jantar linha Ilustre. Alumínio total.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '80x80x75',   preco: 1841.50 },
      { medida: '100x100x75', preco: 2360.00 },
    ],
  },
  {
    id: 91,
    nome: 'Mesa Industrial (alumínio redonda)',
    descricao: 'Mesa de jantar linha Industrial redonda. Alumínio total.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x75', preco: 2189.80 },
      { medida: '120x75', preco: 2556.45 },
      { medida: '150x75', preco: 3766.25 },
      { medida: '180x75', preco: 4206.25 },
    ],
  },
  {
    id: 92,
    nome: 'Mesa Industrial (alumínio retangular)',
    descricao: 'Mesa de jantar linha Industrial retangular. Alumínio total.',
    img: '',
    status: 'Mesa de Jantar',
    variacoes: [
      { medida: '100x100x75', preco: 2208.15 },
      { medida: '120x120x75', preco: 2483.10 },
      { medida: '160x100x75', preco: 3363.00 },
      { medida: '240x100x75', preco: 4682.90 },
      { medida: '300x100x75', preco: 6186.15 },
    ],
  },

  // ─── MESAS DE CENTRO ─────────────────────────────────────────────────────────

  {
    id: 3,
    nome: 'Mesa de Centro Ilustre',
    descricao: 'Mesa de centro em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id03.webp',
    status: 'Mesa de Centro',
    variacoes: [
      { medida: '80cm',  tampo: 'Pizza', preco: 2378.65 },
      { medida: '100cm', tampo: 'Pizza', preco: 2637.05 },
    ],
  },
  {
    id: 7,
    nome: 'Mesa de Centro Astúcia',
    descricao: 'Mesa de centro em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id07.webp',
    status: 'Mesa de Centro',
    variacoes: [
      { medida: '80cm',  tampo: 'Pizza', preco: 1698.20 },
      { medida: '100cm', tampo: 'Pizza', preco: 1956.60 },
    ],
  },
  {
    id: 11,
    nome: 'Mesa de Centro Artístico',
    descricao: 'Mesa de centro em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id11.webp',
    status: 'Mesa de Centro',
    variacoes: [
      { medida: '80cm',  tampo: 'Ripado',   preco: 1886.70 },
      { medida: '100cm', tampo: 'Ripado',   preco: 2129.10 },
      { medida: '80cm',  tampo: 'Pizza',    preco: 1924.00 },
      { medida: '100cm', tampo: 'Pizza',    preco: 2182.40 },
      { medida: '80cm',  tampo: 'Alumínio', preco: 1236.55 },
      { medida: '100cm', tampo: 'Alumínio', preco: 1970.00 },
    ],
  },
  {
    id: 24,
    nome: 'Mesa de Centro Fascínio',
    descricao: 'Mesa de centro em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id24.webp',
    status: 'Mesa de Centro',
    variacoes: [
      { medida: '80cm',  tampo: 'Alumínio', preco: 1163.20 },
      { medida: '100cm', tampo: 'Alumínio', preco: 1896.45 },
    ],
  },
  {
    id: 93,
    nome: 'Mesa de Centro Trivial',
    descricao: 'Mesa de centro em alumínio.',
    img: '',
    status: 'Mesa de Centro',
    variacoes: [
      { tampo: 'Alumínio', preco: 943.30 },
    ],
  },
  { id: 32, nome: 'Mesa Soft', descricao: 'Mesa de centro e canto com tampo em madeira.', img: '/Imagens/Produtos/Img.Id32.webp', status: 'Mesa', variacoes: [{ preco: 1771.35 }] },

  // ─── MESAS DE CANTO ───────────────────────────────────────────────────────────

  {
    id: 4,
    nome: 'Mesa de Canto Ilustre',
    descricao: 'Mesa de canto em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id04.webp',
    status: 'Mesa de Canto',
    variacoes: [
      { tampo: 'Pizza', preco: 2146.65 },
    ],
  },
  {
    id: 8,
    nome: 'Mesa de Canto Astúcia',
    descricao: 'Mesa de canto em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id08.webp',
    status: 'Mesa de Canto',
    variacoes: [
      { tampo: 'Pizza',    preco: 1137.90 },
      { tampo: 'Ripado',   preco: 1111.25 },
      { tampo: 'Alumínio', preco:  686.65 },
    ],
  },
  {
    id: 12,
    nome: 'Mesa de Canto Artístico',
    descricao: 'Mesa de canto em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id12.webp',
    status: 'Mesa de Canto',
    variacoes: [
      { tampo: 'Ripado',   preco: 1319.05 },
      { tampo: 'Pizza',    preco: 1345.65 },
      { tampo: 'Alumínio', preco:  759.90 },
    ],
  },
  {
    id: 25,
    nome: 'Mesa de Canto Fascínio',
    descricao: 'Mesa de canto em alumínio 100%.',
    img: '/Imagens/Produtos/Img.Id25.webp',
    status: 'Mesa de Canto',
    variacoes: [
      { tampo: 'Alumínio', preco: 686.65 },
    ],
  },
  {
    id: 94,
    nome: 'Mesa de Canto Trivial',
    descricao: 'Mesa de canto em alumínio.',
    img: '',
    status: 'Mesa de Canto',
    variacoes: [
      { tampo: 'Alumínio', preco: 649.90 },
    ],
  },

  // ─── CHAMPANHEIRAS ────────────────────────────────────────────────────────────

  {
    id: 95,
    nome: 'Champanheira Ilustre',
    descricao: 'Champanheira linha Ilustre em alumínio e corda náutica.',
    img: '',
    status: 'Champanheira',
    variacoes: [
      { medida: '80cm',   tampo: 'Alumínio', preco: 2420.15 },
      { medida: '100cm',  tampo: 'Alumínio', preco: 3202.35 },
      { medida: '80cm',   tampo: 'Madeira',  preco: 2431.90 },
      { medida: '100cm',  tampo: 'Madeira',  preco: 2690.30 },
      { medida: '80cm',   tampo: 'Alumínio (compacta)', preco: 1433.15 },
      { medida: '100cm',  tampo: 'Alumínio (compacta)', preco: 2166.40 },
    ],
  },

  // ─── BISTRÔS ──────────────────────────────────────────────────────────────────

  {
    id: 96,
    nome: 'Bistrô Astúcia',
    descricao: 'Mesa bistrô linha Astúcia em alumínio.',
    img: '',
    status: 'Bistrô',
    variacoes: [
      { tampo: 'Alumínio', preco: 1236.35 },
      { tampo: 'Pizza',    preco: 1348.65 },
    ],
  },
  {
    id: 97,
    nome: 'Bistrô Star Leve',
    descricao: 'Mesa bistrô linha Star Leve em alumínio.',
    img: '',
    status: 'Bistrô',
    variacoes: [
      { tampo: 'Alumínio', preco: 1016.55 },
      { tampo: 'Ripado',   preco: 1113.90 },
    ],
  },
  {
    id: 98,
    nome: 'Bistrô Italia',
    descricao: 'Mesa bistrô linha Italia em alumínio.',
    img: '',
    status: 'Bistrô',
    variacoes: [
      { tampo: 'Alumínio', preco: 2288.75 },
      { tampo: 'Pizza',    preco: 2355.65 },
    ],
  },
  {
    id: 99,
    nome: 'Bistrô Industrial',
    descricao: 'Mesa bistrô linha Industrial. Tampo alumínio.',
    img: '',
    status: 'Bistrô',
    variacoes: [{ preco: 1346.55 }],
  },

  // ─── MESA ILUSTRE AUXILIAR ────────────────────────────────────────────────────

  {
    id: 100,
    nome: 'Mesa Ilustre 80cm',
    descricao: 'Mesa auxiliar linha Ilustre. Tampo alumínio. 80 cm.',
    img: '',
    status: 'Mesa',
    variacoes: [{ preco: 1383.20 }],
  },

  // ─── TAPETES & ACESSÓRIOS ─────────────────────────────────────────────────────

  {
    id: 101,
    nome: 'Tapete Oval',
    descricao: 'Tapete oval em fibra natural.',
    img: '',
    status: 'Tapete',
    variacoes: [
      { medida: 'P – 50x77 cm',  preco: 228.70 },
      { medida: 'M – 50x100 cm', preco: 415.60 },
    ],
  },
  {
    id: 102,
    nome: 'Passadeira',
    descricao: 'Passadeira em fibra natural. Largura 50 cm.',
    img: '',
    status: 'Tapete',
    variacoes: [
      { medida: 'M – 150 cm', preco: 484.85 },
      { medida: 'G – 180 cm', preco: 623.40 },
    ],
  },
  {
    id: 103,
    nome: 'Tapete Redondo',
    descricao: 'Tapete redondo em fibra natural.',
    img: '',
    status: 'Tapete',
    variacoes: [
      { medida: 'PP – Ø70 cm',  preco:  379.65 },
      { medida: 'P – Ø100 cm',  preco:  658.00 },
      { medida: 'M – Ø150 cm',  preco: 2077.95 },
      { medida: 'G – Ø180 cm',  preco: 2216.45 },
      { medida: 'GG – Ø200 cm', preco: 2424.25 },
    ],
  },
  { id: 104, nome: 'Porta Copo 12 cm',      descricao: 'Porta copo em fibra natural. Ø12 cm.',     img: '', status: 'Acessório', variacoes: [{ preco: 38.20 }] },
  { id: 105, nome: 'Sousplat 36 cm',        descricao: 'Sousplat em fibra natural. Ø36 cm.',       img: '', status: 'Acessório', variacoes: [{ preco: 76.60 }] },
  { id: 106, nome: 'Lugar Americano 49 cm', descricao: 'Lugar americano em fibra natural. Ø49 cm.',img: '', status: 'Acessório', variacoes: [{ preco: 92.90 }] },

  // ─── CAMINHAS KING ────────────────────────────────────────────────────────────

  { id: 107, nome: 'Caminha King Oval',    descricao: 'Caminha para pets King. Formato oval. L:70 cm / A:20 cm.',    img: '', status: 'Caminha', variacoes: [{ preco: 907.10 }] },
  { id: 108, nome: 'Caminha King Redonda', descricao: 'Caminha para pets King. Formato redondo. L:70 cm / A:20 cm.', img: '', status: 'Caminha', variacoes: [{ preco: 1554.45 }] },
];

const formatPrice = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtPDF = (v) => Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ─── ICONES POR CATEGORIA ────────────────────────────────────────────────────
const iconesCategoria = {
  'Sofá': '🛋️',
  'Poltrona': '💺',
  'Mesa de Centro': '◀▶',
  'Mesa de Canto': '◇',
  'Mesa': '◻',
  'Chaise': '☀',
  'Cadeira': '🪑',
  'Banqueta': '🔘',
  'Modular': '⬡',
  'Puff': '◉',
  'Balanço': '🌙',
  'Espreguiçadeira': '∽',
  'Acessório': '⚙',
};

// ─── MODAL DE CORES ──────────────────────────────────────────────────────────
function ModalPersonalizacao({ aberto, onFechar, onConfirmar, selecoes, setSelecoes }) {
  const [aba, setAba] = useState('pintura');
  if (!aberto) return null;
  function selecionar(item) {
    setSelecoes(prev => {
      const novo = { ...prev };
      if (novo[item.cat]?.id === item.id) delete novo[item.cat]; else novo[item.cat] = item;
      return novo;
    });
  }
  const listas = { pintura: PINTURA, cordas: CORDAS, tecidos: TECIDOS };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-drawer" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div><p className="modal-eyebrow">Kasaleve</p><h2 className="modal-title">Escolher Cores</h2></div>
          <button className="modal-close" onClick={onFechar}>✕</button>
        </div>
        <div className="modal-tabs">
          {[{ id: 'pintura', label: 'Alumínio' }, { id: 'cordas', label: 'Cordas' }, { id: 'tecidos', label: 'Tecidos' }].map(a => (
            <button key={a.id} className={`modal-tab ${aba === a.id ? 'modal-tab--active' : ''}`} onClick={() => setAba(a.id)}>{a.label}</button>
          ))}
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            {listas[aba].map(item => (
              <div key={item.id} className={`modal-chip-pintura ${selecoes[item.cat]?.id === item.id ? 'modal-chip--sel' : ''}`} onClick={() => selecionar(item)}>
                <div className="modal-chip-pintura__placa" style={{ background: item.hex }}>{selecoes[item.cat]?.id === item.id && '✓'}</div>
                <p>{item.nome}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-limpar" onClick={() => setSelecoes({})}>Limpar</button>
          <button className="modal-btn-confirmar" onClick={onConfirmar}>Confirmar Seleção</button>
        </div>
      </div>
    </div>
  );
}

// ─── PREVIEW DA COMBINAÇÃO ───────────────────────────────────────────────────
function PreviewCombinacao({ selecoes, onEditar }) {
  const temSelecao = Object.keys(selecoes).length > 0;
  return (
    <div className="preview-box">
      <div className="preview-box__header">
        <p className="preview-box__title">Sua Seleção</p>
        {temSelecao && <button className="preview-box__edit" onClick={onEditar}>✏️ Editar</button>}
      </div>
      {!temSelecao ? (
        <div className="preview-vazio"><p>Nenhuma cor selecionada</p></div>
      ) : (
        <>
          <div className="preview-barras">
            {selecoes.pintura && <div className="preview-barra" style={{ background: selecoes.pintura.hex }}><span>Alumínio</span><b>{selecoes.pintura.nome}</b></div>}
            {selecoes.corda && <div className="preview-barra" style={{ background: selecoes.corda.hex, color: '#fff' }}><span>Corda</span><b>{selecoes.corda.nome}</b></div>}
            {selecoes.tecido && <div className="preview-barra" style={{ background: selecoes.tecido.hex }}><span>Tecido</span><b>{selecoes.tecido.nome}</b></div>}
          </div>
          <div className="preview-paleta">{Object.values(selecoes).map(s => (<div key={s.id} className="preview-paleta__dot" style={{ background: s.hex }} title={s.nome} />))}</div>
        </>
      )}
    </div>
  );
}

// ─── PDF INDUSTRIAL ──────────────────────────────────────────────────────────
async function gerarPDF(itensCarrinho) {
  const { default: jsPDF } = await import('jspdf');

  const imagens = {};
  await Promise.all(
    itensCarrinho.map(async (item) => {
      if (!imagens[item.id] && item.img) {
        try {
          const resp = await fetch(item.img);
          const blob = await resp.blob();
          imagens[item.id] = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch { imagens[item.id] = null; }
      }
    })
  );

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const M = 15, W = 180, R = M + W;
  let y = M;

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8);
  doc.line(M, M - 5, R, M - 5);
  doc.setLineWidth(0.25); doc.line(M, M - 3, R, M - 3);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(0, 0, 0);
  doc.text('KASALEVE IND. DECOR MOVEIS LTDA', M, y + 4); y += 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80);
  doc.text('Pederneiras - SP  |  CNPJ: 00.000.000/0001-00  |  www.kasaleve.com.br', M, y + 2); y += 4;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, y + 2, R, y + 2); y += 8;

  const numOrc = `ORC-${String(Date.now()).slice(-6)}`;
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
  doc.text(`ORCAMENTO: ${numOrc}`, M, y);
  doc.text(`DATA: ${dataHoje}`, R, y, { align: 'right' }); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(100, 100, 100);
  doc.text('Validade: 5 dias uteis a partir da emissao.', M, y);
  doc.setTextColor(0, 0, 0); y += 8;

  const cImg = M, cProd = M + 22, cPers = M + 76, cQtd = M + 130, cUnit = M + 146, cTot = R - 3;
  const colLines = [M + 20, cPers - 2, cQtd - 2, cUnit - 2];

  const headerH = 8;
  doc.setFillColor(30, 30, 30); doc.rect(M, y, W, headerH, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
  doc.text('IMG', cImg + 4, y + 5.5);
  doc.text('PRODUTO', cProd, y + 5.5);
  doc.text('PERSONALIZACAO', cPers, y + 5.5);
  doc.text('QTD', cQtd, y + 5.5);
  doc.text('UNITARIO', cUnit, y + 5.5);
  doc.text('TOTAL', cTot, y + 5.5, { align: 'right' });
  y += headerH;

  const totalProdutos = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
  const rowH = 18, imgSize = 14, imgPad = 2;

  itensCarrinho.forEach((item, index) => {
    if (y + rowH > 270) {
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(M, 287, R, 287);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(140, 140, 140);
      doc.text(`${numOrc}  |  Kasaleve Industria Decor Moveis LTDA  |  Pagina ${doc.getNumberOfPages()}`, M + W / 2, 291, { align: 'center' });
      doc.addPage(); y = M;
    }

    if (index % 2 !== 0) { doc.setFillColor(243, 243, 243); doc.rect(M, y, W, rowH, 'F'); }

    doc.setDrawColor(170, 170, 170); doc.setLineWidth(0.2); doc.rect(M, y, W, rowH);
    doc.setDrawColor(190, 190, 190); doc.setLineWidth(0.15);
    colLines.forEach(x => { doc.line(x, y, x, y + rowH); });
    doc.setDrawColor(60, 60, 60); doc.setLineWidth(0.5);
    doc.line(cUnit - 2, y, cUnit - 2, y + rowH);

    if (imagens[item.id]) {
      doc.addImage(imagens[item.id], 'JPEG', cImg + imgPad, y + imgPad, imgSize, imgSize);
    } else {
      doc.setFillColor(230, 230, 230); doc.rect(cImg + imgPad, y + imgPad, imgSize, imgSize, 'F');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(150, 150, 150);
      doc.text('IMG', cImg + imgPad + imgSize / 2, y + imgPad + imgSize / 2 + 2, { align: 'center' });
    }

    const textY = y + 7;
    doc.setTextColor(0, 0, 0); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(item.nome, cProd, textY, { maxWidth: cPers - 2 - cProd - 2 });

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(60, 60, 60);
    const pers = [];
    if (item.personalizacao?.pintura) pers.push(`AL: ${item.personalizacao.pintura.nome}`);
    if (item.personalizacao?.corda) pers.push(`CO: ${item.personalizacao.corda.nome}`);
    if (item.personalizacao?.tecido) pers.push(`TE: ${item.personalizacao.tecido.nome}`);
    if (pers.length > 0) doc.text(pers.join(' / '), cProd, textY + 5, { maxWidth: cPers - 2 - cProd - 4 });

    doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text(String(item.qtd), cQtd + 2, textY + 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text(fmtPDF(item.preco), cTot - 22, textY + 2, { align: 'right' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text(fmtPDF(item.preco * item.qtd), cTot, textY + 2, { align: 'right' });

    y += rowH;
  });

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, y, R, y); y += 10;

  const frete = totalProdutos * 0.085;
  const totalGeral = totalProdutos + frete;
  const blocX = cQtd - 2, blocW = R - blocX;

  doc.setDrawColor(150, 150, 150); doc.setLineWidth(0.2); doc.setFillColor(248, 248, 248);
  doc.rect(blocX, y, blocW, 10, 'FD');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30);
  doc.text('SUBTOTAL', blocX + 5, y + 6.5);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text(`R$ ${fmtPDF(totalProdutos)}`, R - 4, y + 6.5, { align: 'right' }); y += 10;

  doc.setFillColor(248, 248, 248); doc.rect(blocX, y, blocW, 10, 'FD');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30);
  doc.text('FRETE ESTIMADO', blocX + 5, y + 6.5);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text(`R$ ${fmtPDF(frete)}`, R - 4, y + 6.5, { align: 'right' }); y += 14;

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(blocX, y - 4, R, y - 4);
  doc.setFillColor(25, 25, 25); doc.rect(blocX, y, blocW, 12, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', blocX + 5, y + 8);
  doc.text(`R$ ${fmtPDF(totalGeral)}`, R - 4, y + 8, { align: 'right' }); y += 20;

  doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.text('OBSERVACOES:', M, y); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(50, 50, 50);
  ['- Valores sujeitos a alteracao apos o prazo de validade.', '- Frete estimado. Valor final definido apos confirmacao de endereco.', '- Producao iniciada apos aprovacao do orcamento e sinal conforme combinado.', '- Prazo de producao: a combinar.'].forEach(o => { doc.text(o, M, y + 3); y += 3.8; });

  y = Math.max(y + 18, 248);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.25);
  doc.line(M, y, M + 65, y); doc.line(R - 65, y, R, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(0, 0, 0);
  doc.text('CLIENTE', M + 32, y + 5, { align: 'center' });
  doc.text('KASALEVE', R - 32, y + 5, { align: 'center' });

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(M, 287, R, 287);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(140, 140, 140);
  doc.text(`${numOrc}  |  Gerado em ${dataHoje}  |  Kasaleve Industria Decor Moveis LTDA  |  Pederneiras - SP`, M + W / 2, 291, { align: 'center' });

  doc.save(`Orcamento_${numOrc}.pdf`);
}

// ─── TELA DE DETALHE ──────────────────────────────────────────────────────────
function TelaDetalhe({ produto, onVoltar, onAddCarrinho }) {
  const { loggedin } = useContext(AuthContext);
  const [selecoes, setSelecoes] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [variacaoSel, setVariacaoSel] = useState(0);

  function adicionar() {
    const precoAdicional = produto.variacoes?.[variacaoSel]?.preco || 0;
    onAddCarrinho({
      ...produto,
      preco: precoAdicional,
      medida: produto.variacoes?.[variacaoSel]?.medida || '',
      qtd,
      personalizacao: selecoes,
      cartId: Date.now()
    });
    onVoltar();
  }

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container detalhe-container">
        <button className="btn-voltar-det" onClick={onVoltar}>← Voltar</button>
        <div className="detalhe-grid">
          <div className="detalhe-img-box">
            {produto.img ? (
              <img src={produto.img} alt={produto.nome} className="detalhe-img" />
            ) : (
              <div className="detalhe-img-placeholder">
                <span>{iconesCategoria[produto.status] || '📦'}</span>
                <p>{produto.nome}</p>
              </div>
            )}
          </div>
          <div className="detalhe-info">
            <span className="detalhe-categoria-badge">{iconesCategoria[produto.status]} {produto.status}</span>
            <h1 className="detalhe-nome">{produto.nome}</h1>
            <p className="detalhe-desc">{produto.descricao}</p>
            {loggedin ? (
              <>
                {/* Seletor de variação */}
                {produto.variacoes?.length > 1 && (
                  <div className="detalhe-variacoes">
                    <label className="detalhe-variacoes__label">Medida:</label>
                    <div className="detalhe-variacoes__opts">
                      {produto.variacoes.map((v, i) => (
                        <button
                          key={i}
                          className={`detalhe-variacao-btn ${variacaoSel === i ? 'detalhe-variacao-btn--active' : ''}`}
                          onClick={() => setVariacaoSel(i)}
                        >
                          {v.medida || `Opção ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="detalhe-preco">
                  {(produto.variacoes?.[variacaoSel]?.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  {produto.variacoes?.[variacaoSel]?.medida && (
                    <span className="detalhe-preco__medida"> — {produto.variacoes[variacaoSel].medida}</span>
                  )}
                </p>
                <div className="qtd-selector">
                  <span>Quantidade:</span>
                  <div className="qtd-box">
                    <button onClick={() => setQtd(qtd > 1 ? qtd - 1 : 1)}>-</button>
                    <span>{qtd}</span>
                    <button onClick={() => setQtd(qtd + 1)}>+</button>
                  </div>
                </div>
                <div className="detalhe-separador" />
                <PreviewCombinacao selecoes={selecoes} onEditar={() => setModalAberto(true)} />
                <button className="btn-personalizar" onClick={() => setModalAberto(true)}>🎨 Alterar Cores</button>
                <button className="btn-add-carrinho" onClick={adicionar}>Adicionar ao Carrinho</button>
              </>
            ) : (
              <div className="detalhe-login-teaser">
                <div className="teaser-icon">🔒</div>
                <h3>Área Restrita</h3>
                <p>Faça login para ver preços e montar seu pedido.</p>
                <Link to="/Login" className="teaser-btn">Fazer Login <span>→</span></Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalPersonalizacao aberto={modalAberto} onFechar={() => setModalAberto(false)} onConfirmar={() => setModalAberto(false)} selecoes={selecoes} setSelecoes={setSelecoes} />
    </div>
  );
}

// ─── TAG DE COR DO CARRINHO ───────────────────────────────────────────────────
function CorTag({ label, cor }) {
  return (
    <span className="cart-cor-tag">
      <span className="cart-cor-tag__dot" style={{ background: cor.hex }} />
      {label}: {cor.nome}
    </span>
  );
}

// ─── TELA DO CARRINHO ─────────────────────────────────────────────────────────
function TelaCheckout({ carrinho, setCarrinho, onVoltar }) {
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [notas, setNotas] = useState('');

  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
  const desconto = cupomAplicado ? subtotal * 0.05 : 0;
  const frete = carrinho.length > 0 ? (subtotal - desconto) * 0.085 : 0;
  const total = subtotal - desconto + frete;
  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);

  function alterarQtd(cartId, delta) {
    setCarrinho(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const novaQtd = item.qtd + delta;
        return novaQtd > 0 ? { ...item, qtd: novaQtd } : null;
      }
      return item;
    }).filter(Boolean));
  }

  function removerItem(cartId) { setCarrinho(prev => prev.filter(i => i.cartId !== cartId)); }

  function aplicarCupom() {
    if (cupom.trim().toUpperCase() === 'KASALEVE5') setCupomAplicado(true);
  }

  function finalizar() {
    if (carrinho.length === 0) return;
    gerarPDF(carrinho);
    setCarrinho([]); setCupomAplicado(false); setCupom(''); setNotas('');
    alert("Orçamento gerado com sucesso!");
    onVoltar();
  }

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="cart-page">
        <div className="cart-breadcrumb">
          <button className="cart-breadcrumb__link" onClick={onVoltar}>Loja</button>
          <span className="cart-breadcrumb__sep">/</span>
          <span className="cart-breadcrumb__current">Carrinho</span>
        </div>

        {carrinho.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2 className="cart-empty__title">Seu carrinho está vazio</h2>
            <p className="cart-empty__text">Explore nosso catálogo e adicione produtos para montar seu orçamento.</p>
            <button className="cart-empty__btn" onClick={onVoltar}>Explorar Produtos</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-items__header">
                <h1 className="cart-items__title">Carrinho</h1>
                <span className="cart-items__count">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
              </div>

              <div className="cart-list">
                {carrinho.map(item => (
                  <div className="cart-item" key={item.cartId}>
                    <div className="cart-item__img-wrap">
                      {item.img ? (
                        <img src={item.img} alt={item.nome} className="cart-item__img" />
                      ) : (
                        <div className="cart-item__img-placeholder">
                          <span>{iconesCategoria[item.status] || '📦'}</span>
                        </div>
                      )}
                    </div>
                    <div className="cart-item__info">
                      <div className="cart-item__top">
                        <div>
                          <h3 className="cart-item__name">{item.nome}</h3>
                          {item.medida && <span className="cart-item__medida">{item.medida}</span>}
                        </div>
                        <button className="cart-item__remove" onClick={() => removerItem(item.cartId)} title="Remover">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>
                      <div className="cart-item__cores">
                        {item.personalizacao?.pintura && <CorTag label="Alumínio" cor={item.personalizacao.pintura} />}
                        {item.personalizacao?.corda && <CorTag label="Corda" cor={item.personalizacao.corda} />}
                        {item.personalizacao?.tecido && <CorTag label="Tecido" cor={item.personalizacao.tecido} />}
                      </div>
                      <div className="cart-item__bottom">
                        <div className="cart-item__qty">
                          <button className="cart-qty-btn" onClick={() => alterarQtd(item.cartId, -1)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="cart-qty-value">{item.qtd}</span>
                          <button className="cart-qty-btn" onClick={() => alterarQtd(item.cartId, 1)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <div className="cart-item__price">
                          <span className="cart-item__unit">{formatPrice(item.preco)} un.</span>
                          <span className="cart-item__total">{formatPrice(item.preco * item.qtd)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-coupon">
                <div className="cart-coupon__input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                  <input type="text" className="cart-coupon__input" placeholder="Código de cupom" value={cupom} onChange={e => setCupom(e.target.value)} disabled={cupomAplicado} />
                </div>
                <button className="cart-coupon__btn" onClick={aplicarCupom} disabled={cupomAplicado}>{cupomAplicado ? 'Aplicado ✓' : 'Aplicar'}</button>
              </div>

              <div className="cart-notes">
                <label className="cart-notes__label">Observações do pedido</label>
                <textarea className="cart-notes__textarea" placeholder="Ex: Entregar após as 14h, contatar com João..." value={notas} onChange={e => setNotas(e.target.value)} rows={3} />
              </div>
            </div>

            <div className="cart-summary">
              <div className="cart-summary__card">
                <h2 className="cart-summary__title">Resumo do Pedido</h2>
                <div className="cart-summary__rows">
                  <div className="cart-summary__row"><span>Subtotal ({totalItens} itens)</span><span>{formatPrice(subtotal)}</span></div>
                  {cupomAplicado && (<div className="cart-summary__row cart-summary__row--discount"><span>Desconto (5%)</span><span>-{formatPrice(desconto)}</span></div>)}
                  <div className="cart-summary__row"><span>Frete estimado</span><span>{formatPrice(frete)}</span></div>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__total"><span>Total</span><span className="cart-summary__total-value">{formatPrice(total)}</span></div>
                <p className="cart-summary__frete-note">*Frete calculado automaticamente. Valor final confirmado após aprovação.</p>
                <button className="cart-summary__btn" onClick={finalizar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                  Gerar Orçamento PDF
                </button>
                <button className="cart-summary__btn-sec" onClick={onVoltar}>Continuar Comprando</button>
                <div className="cart-summary__badges">
                  <div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg><span>Frete calculado</span></div>
                  <div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><span>Orçamento seguro</span></div>
                  <div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /></svg><span>Personalizado</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TELA PRINCIPAL ───────────────────────────────────────────────────────────
function Carrinho() {
  const { loggedin } = useContext(AuthContext);
  const [tela, setTela] = useState('lista');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  // Extrai categorias únicas com contagem
  const categorias = useMemo(() => {
    const map = {};
    produtos.forEach(p => { map[p.status] = (map[p.status] || 0) + 1; });
    return [{ nome: 'Todos', count: produtos.length }, ...Object.entries(map).map(([nome, count]) => ({ nome, count }))].sort((a, b) => {
      if (a.nome === 'Todos') return -1;
      if (b.nome === 'Todos') return 1;
      return a.nome.localeCompare(b.nome);
    });
  }, []);

  // Filtra os produtos
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchCategoria = filtroAtivo === 'Todos' || p.status === filtroAtivo;
      const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [filtroAtivo, busca]);

  if (tela === 'checkout') return <TelaCheckout carrinho={carrinho} setCarrinho={setCarrinho} onVoltar={() => setTela('lista')} />;
  if (tela === 'detalhe' && produtoSelecionado) return <TelaDetalhe produto={produtoSelecionado} onVoltar={() => setTela('lista')} onAddCarrinho={(item) => setCarrinho(prev => [...prev, item])} />;

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container">
        <div className="loja-header">
          <BTNVolta />
          <div className="loja-header__text">
            <p className="eyebrow">Catálogo Kasaleve</p>
            <h1 className="loja-title">{loggedin ? 'Monte seu Pedido' : 'Conheça nossos Produtos'}</h1>
          </div>
          <div className="loja-header__actions">
            {loggedin && carrinho.length > 0 && (
              <button className="btn-ver-carrinho" onClick={() => setTela('checkout')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                Ver Carrinho ({carrinho.length}) →
              </button>
            )}
          </div>
        </div>

        {/* ── BARRA DE BUSCA ── */}
        <div className="loja-search">
          <svg className="loja-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            className="loja-search__input"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {busca && (
            <button className="loja-search__clear" onClick={() => setBusca('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>

        {/* ── FILTROS POR CATEGORIA ── */}
        <div className="loja-filtros">
          <div className="loja-filtros__scroll">
            {categorias.map(cat => (
              <button
                key={cat.nome}
                className={`loja-filtro-btn ${filtroAtivo === cat.nome ? 'loja-filtro-btn--active' : ''}`}
                onClick={() => setFiltroAtivo(cat.nome)}
              >
                {cat.nome !== 'Todos' && <span className="loja-filtro-btn__icon">{iconesCategoria[cat.nome] || '📦'}</span>}
                <span className="loja-filtro-btn__label">{cat.nome}</span>
                <span className="loja-filtro-btn__count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTADOR DE RESULTADOS ── */}
        <div className="loja-resultados">
          <span>{produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</span>
          {(filtroAtivo !== 'Todos' || busca) && (
            <button className="loja-resultados__clear" onClick={() => { setFiltroAtivo('Todos'); setBusca(''); }}>
              Limpar filtros
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>

        {/* ── GRID DE PRODUTOS ── */}
        {produtosFiltrados.length > 0 ? (
          <div className="loja-grid">
            {produtosFiltrados.map((p, i) => (
              <div className="produto-card" key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="produto-card__img-wrap">
                  {p.img ? (
                    <img src={p.img} alt={p.nome} className="produto-card__img" />
                  ) : (
                    <div className="produto-card__img-placeholder">
                      <span className="produto-card__placeholder-icon">{iconesCategoria[p.status] || '📦'}</span>
                      <span className="produto-card__placeholder-name">{p.nome}</span>
                    </div>
                  )}
                  <span className="produto-card__badge">{p.status}</span>
                </div>
                <div className="produto-card__body">
                  <h3 className="produto-card__nome">{p.nome}</h3>
                  <p className="produto-card__desc">{p.descricao}</p>
                  {loggedin && p.variacoes?.length > 1 && (
                    <div className="produto-card__variacoes-info">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                      {p.variacoes.length} variações disponíveis
                    </div>
                  )}
                  <div className="produto-card__footer">
                    {loggedin ? (
                      <>
                        <div className="produto-card__preco-row">
                          <span className="produto-card__preco">
                            {formatPrice(p.variacoes?.[0]?.preco || 0)}
                          </span>
                          {p.variacoes?.length > 1 && (
                            <span className="produto-card__preco-range">
                              a partir de
                            </span>
                          )}
                        </div>
                        <button className="btn-comprar" onClick={() => { setProdutoSelecionado(p); setTela('detalhe'); }}>Personalizar →</button>
                      </>
                    ) : (
                      <Link to="/Login" className="btn-login-catalogo">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Desbloquear preço
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loja-empty-search">
            <div className="loja-empty-search__icon">🔍</div>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente alterar os filtros ou o termo de busca.</p>
            <button className="loja-empty-search__btn" onClick={() => { setFiltroAtivo('Todos'); setBusca(''); }}>Ver todos os produtos</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrinho;