// var AfterimageShader = {
//     uniforms: {
//         'damp': { value: 0.99 },
//         'tOld': { value:0.99 },
//         'tNew': { value: 0.99 },
//       'radius': { value: 0.2 } ,// Ajout de la variable "radius" avec une valeur par défaut
//       'mouseX': { value: 0 }, // Ajoutez ces lignes
//       'mouseY': { value: 0 }, // Ajoutez ces lignes
//     },
//     vertexShader: [
//       'varying vec2 vUv;',
//       'void main() {',
//       '  vUv = uv;',
//       '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
//       '}'
//     ].join('\n'),
//     fragmentShader: [
//         'uniform float mouseX;',
//         'uniform float mouseY;',
//         'uniform float aspectRatio;',
//       'uniform float damp;',
//       'uniform float radius;', // Ajout de la variable "radius"
//       'uniform sampler2D tOld;',
//       'uniform sampler2D tNew;',
//       'varying vec2 vUv;',
//       'vec4 when_gt( vec4 x, float y ) {',
//       '  return max( sign( x - y ), 0.0 );',
//       '}',
//       'void main() {',
//       '    vec2 mousePos = vec2((mouseX * 0.5 + 0.5) * aspectRatio, mouseY )  ;',
    
   
//       'vec2 adjustedUV = vUv;',
   
//      ' adjustedUV.x *= aspectRatio; ',
//       '  float distanceToMouse = length(adjustedUV - mousePos);',
//       '  vec4 texelOld = texture2D( tOld, vUv );',
//       '  vec4 texelNew = texture2D( tNew, vUv );',




   
//       '  if (distanceToMouse <= radius) {', // Appliquer l'effet d'afterimage dans le rayon
    
//       '    gl_FragColor = mix(texelNew, texelOld, 1.9);',
//       '  } else {', // Ne pas appliquer l'effet d'afterimage à l'extérieur du rayon
      
//       '    gl_FragColor = texelNew;',
//       '  }',
      

      
//       '}'
//     ].join('\n')
//   };
  
//   export { AfterimageShader };


var AfterimageShader = {
    uniforms: {
        'damp': { value: 0.04 },
        'tOld': { value:0.09 },
        'tNew': { value: 0.09 },
      'radius': { value: 0.2 } ,// Ajout de la variable "radius" avec une valeur par défaut
      'mouseX': { value: 0 }, // Ajoutez ces lignes
      'mouseY': { value: 0 }, // Ajoutez ces lignes
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
    fragmentShader: [
        'uniform float mouseX;',
        'uniform float mouseY;',
        'uniform float aspectRatio;',
      'uniform float damp;',
      'uniform float radius;', // Ajout de la variable "radius"
      'uniform sampler2D tOld;',
      'uniform sampler2D tNew;',
      'varying vec2 vUv;',
      'vec4 when_gt( vec4 x, float y ) {',
      '  return max( sign( x - y ), 0.0 );',
      '}',
      'void main() {',
      '    vec2 mousePos = vec2((mouseX * 0.5 + 0.5) * aspectRatio, mouseY )  ;',
    
   
      'vec2 adjustedUV = vUv;',
   
     ' adjustedUV.x *= aspectRatio; ',
      '  float distanceToMouse = length(adjustedUV - mousePos);',
      '	vec4 texelOld = texture2D( tOld, vUv );',
      '	vec4 texelNew = texture2D( tNew, vUv );',




   
      '  if (distanceToMouse < radius) {', // Appliquer l'effet d'afterimage dans le rayon
      '   texelOld *= damp* 1.01 * when_gt(texelOld, 0.003);',
      '    texelNew *= damp *1.0002 * when_gt(texelNew,  0.0001);',
   
      '  } else {', // Ne pas appliquer l'effet d'afterimage à l'extérieur du rayon
      '    texelOld *= damp* 0.5 * when_gt(texelOld, 0.005);',
     
      '  }',
      
      '	gl_FragColor = max(texelNew, texelOld);',
      
      '}'
    ].join('\n')
  };
  
  export { AfterimageShader };


